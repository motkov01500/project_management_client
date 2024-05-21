import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, SortEvent } from 'primeng/api';
import { TablePageEvent } from 'primeng/table';
import { HttpErrorResponse } from '@angular/common/http';
import { MeetingResponse, UserResponse } from 'app/models';
import {
  AuthService,
  MeetingsService,
  SizeService,
  UsersService,
} from 'app/services';

@Component({
  selector: 'app-user-meeting-related',
  templateUrl: './user-meeting-related.component.html',
  styleUrl: './user-meeting-related.component.css',
})
export class UserMeetingRelatedComponent implements OnInit {
  assignUserToMeetingSidebar: boolean = false;
  users: UserResponse[] = [];
  selectedUser: number | undefined;
  totalRecords: number = 1;
  items: UserResponse[] = [];
  currentMeetingId: string | null = localStorage.getItem('current-meeting-id');
  userRole: string | null = this.authService.getRole();
  currentMeeting: MeetingResponse | undefined;
  loading: boolean = false;
  offset: number = 5;
  currentPage: number = 1;
  selectedUsers: number[] = [];
  isDisabled: boolean = false; //TODO domashno
  sortColumn?: string = '';
  sortOrder?: string = '';

  constructor(
    private meetingService: MeetingsService,
    private sizeService: SizeService,
    private router: Router,
    private messageService: MessageService,
    private userService: UsersService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userService
      .getRelatedToMeeting(
        Number(this.currentMeetingId),
        this.currentPage,
        this.offset
      )
      .subscribe({
        next: (users: UserResponse[]) => {
          this.items = users;
        },
      });

    this.sizeService
      .getUsersRelatedToMeeting(Number(this.currentMeetingId))
      .subscribe({
        next: (totalRecords: number) => {
          this.totalRecords = totalRecords;
        },
      });

    this.meetingService.getById(Number(this.currentMeetingId)).subscribe({
      next: (meeting: MeetingResponse) => {
        this.currentMeeting = meeting;
      },
    });
    this.cdr.detectChanges();
  }

  onHomeButton() {
    this.router.navigate(['user', 'projects', 'meetings']);
  }

  onUnAssignUser(userId: number) {
    this.meetingService
      .removeUserFromMeeting(userId, this.currentMeetingId)
      .subscribe({
        next: () => {
          this.items = this.items.filter((item) => item.id != userId);
          this.messageService.add({
            severity: 'success',
            summary: 'User was removed from meeting.',
            detail: 'via admin',
          });
        },
      });
    this.onLazyLoad();
  }

  onChangePage(event: TablePageEvent) {
    this.currentPage = event.first / event.rows + 1;
  }

  onLazyLoad() {
    this.loading = true;
    setTimeout(() => {
      this.userService
        .getRelatedToMeeting(
          Number(this.currentMeetingId),
          this.currentPage,
          this.offset,
          this.sortColumn,
          this.sortOrder
        )
        .subscribe({
          next: (users: UserResponse[]) => {
            this.items = users;
          },
        });

      this.sizeService
        .getUsersRelatedToMeeting(Number(this.currentMeetingId))
        .subscribe({
          next: (totalRecords: number) => {
            this.totalRecords = totalRecords;
          },
        });
      this.loading = false;
    }, 600);
    this.cdr.detectChanges();
  }

  onAssignUserToMeeting() {
    this.userService
      .getUsersThatCanAddToMeeting(this.currentMeeting?.id)
      .subscribe({
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
    this.meetingService
      .assignUserToMeeting(this.selectedUsers, this.currentMeetingId)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'User is successfully added to meeting',
            detail: 'via admin',
          });
          this.assignUserToMeetingSidebar = false;
          this.onLazyLoad();
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

  customSort(event: SortEvent) {
    this.sortColumn = event.field;
    this.sortOrder = event.order == 1 ? 'ascending' : 'descending';
    this.onLazyLoad();
  }
}
