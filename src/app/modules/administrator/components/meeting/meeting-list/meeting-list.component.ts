import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TablePageEvent } from 'primeng/table';
import { MeetingEdit, MeetingResponse, UserResponse } from 'app/models';
import {
  MeetingsService,
  SizeService,
  UsersService,
  WebSocketService,
} from 'app/services';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrl: './meeting-list.component.css',
})
export class MeetingListComponent implements OnInit {
  items: MeetingResponse[] = [];
  visibleSidebar: boolean = false;
  meetingDetails: MeetingResponse | any;
  date: string | undefined;
  statuses: string[] = ['UPCOMING', 'STARTED', 'END'];
  selectedStatus: string = '';
  projectKey: string | null = localStorage.getItem('current-project-key');
  projectTitle: string | null = localStorage.getItem('current-project-title');
  title: string = '';
  assignUserToMeetingSidebar: boolean = false;
  meetingAsign: MeetingResponse | undefined;
  users: UserResponse[] = [];
  selectedUser: MeetingResponse | undefined;
  totalRecords: number = 1;
  loading: boolean = false;
  page: number = 1;
  offset: number = 5;
  sortColumn?: string = '';
  sortOrder?: string = '';

  constructor(
    private service: MeetingsService,
    private userService: UsersService,
    private sizeService: SizeService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private messageService: MessageService,
    private websocketService: WebSocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sizeService.getCurrentProjectMeetingsSize(this.projectKey).subscribe({
      next: (totalRecords: number) => {
        this.totalRecords = totalRecords;
      },
    });
    this.cdr.detectChanges();
  }

  onEdit(meetingId: number) {
    this.visibleSidebar = true;
    this.service.getById(meetingId).subscribe({
      next: (meeting: MeetingResponse) => {
        this.meetingDetails = meeting;
      },
    });
  }

  onDelete(meetingId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      accept: () => {
        this.service.delete(meetingId).subscribe({
          error: (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: error.error.message,
              detail: 'via admin',
            });
          },
        });
        this.items = this.items.filter((item) => item.id != meetingId);
        this.messageService.add({
          severity: 'success',
          summary: 'Meeting Delete',
          detail: 'via admin',
        });
        this.websocketService.sendMessage(`Meeting is deleted`);
        this.onLazyLoad();
      },
      reject: () => {
        this.confirmationService.close();
      },
      key: 'positionDialog',
    });
  }

  onSubmit() {
    let updatedMeeting: MeetingEdit = {
      date: this.date ? this.date : '',
      title: this.title ? this.title : '',
    };
    this.service.editById(this.meetingDetails?.id, updatedMeeting).subscribe({
      next: (meeting: MeetingResponse) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Meeting Edit',
          detail: 'via admin',
        });
        this.onLazyLoad();
        this.websocketService.sendMessage(`Meeting is edited.`);
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error.message,
          detail: 'via admin',
        });
      },
    });
    this.visibleSidebar = false;
    console.log(this.date);
  }

  addMeeting() {
    throw new Error('Method not implemented.');
  }

  onBackToProjects() {
    localStorage.removeItem('current-project-key');
    localStorage.removeItem('current-project-title');
    this.router.navigate(['administrator/project/get-all']);
  }

  onCreateMeeting() {
    this.router.navigate(['administrator', 'projects', 'meetings', 'create']);
  }

  onAssignUserToMeeting(meetingId: number) {
    this.service.getById(meetingId).subscribe({
      next: (meeting: MeetingResponse) => {
        this.meetingAsign = meeting;
      },
    });
    this.userService.getUsersThatCanAddToMeeting(meetingId).subscribe({
      next: (users: UserResponse[]) => {
        this.users = users;
        this.assignUserToMeetingSidebar = true;
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error.message,
          detail: 'via admin',
        });
      },
    });
  }

  onAssignUserToMeetingSubmit() {
    this.service
      .assignUserToMeeting(this.selectedUser?.id, this.meetingAsign?.id)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'User is successfully added to meeting',
            detail: 'via admin',
          });
          this.assignUserToMeetingSidebar = false;
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: error.error.message,
            detail: 'via admin',
          });
        },
      });
  }

  onViewRelatedUsers(meetingId: number) {
    localStorage.setItem('current-meeting-id', meetingId.toString());
    this.router.navigate(['administrator', 'projects', 'meetings', 'users']);
  }

  onChangePage(event: TablePageEvent) {
    this.page = event.first / event.rows + 1;
  }

  onLazyLoad() {
    this.loading = true;
    setTimeout(() => {
      this.service
        .getCurrentProjectMeetings(
          this.projectKey,
          this.page,
          this.offset,
          this.sortColumn,
          this.sortOrder
        )
        .subscribe({
          next: (meetings: MeetingResponse[]) => {
            this.items = meetings;
          },
        });
      this.sizeService
        .getCurrentProjectMeetingsSize(this.projectKey)
        .subscribe({
          next: (totalRecords: number) => {
            this.totalRecords = totalRecords;
          },
        });
      this.loading = false;
    }, 600);
    this.cdr.detectChanges();
  }

  onSelectDate(event: any) {
    this.date = event.toISOString();
  }

  customSort(event: SortEvent) {
    this.sortColumn = event.field;
    this.sortOrder = event.order == 1 ? 'ascending' : 'descending';
    this.onLazyLoad();
  }
}
