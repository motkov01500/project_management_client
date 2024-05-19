import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TablePageEvent } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { MeetingResponse, UserResponse } from 'app/models';
import { MeetingsService, SizeService, UsersService } from 'app/services';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.css',
})
export class MeetingComponent implements OnInit {
  totalRecords: number = 1;
  loading: boolean = false;
  currentUserMeetings: MeetingResponse[] = [];
  viewUserRelatedSidebar: boolean = false;
  meetingRelatedUsers: UserResponse[] = [];
  projectKey: string | null = localStorage.getItem('current-project-key');
  projectTitle: string | null = localStorage.getItem('current-project-title');
  offset: number = 5;
  page: number = 1;

  constructor(
    private meetingService: MeetingsService,
    private messageService: MessageService,
    private sizeService: SizeService,
    private userService: UsersService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.meetingService
    //   .getCurrentUserMeetings(this.projectKey, this.page, this.offset)
    //   .subscribe({
    //     next: (meetings: MeetingResponse[]) => {
    //       this.currentUserMeetings = meetings;
    //     },
    //   });
    this.sizeService.getCurrentUserMeetingsSize(this.projectKey).subscribe({
      next: (totalRecords: number) => {
        this.totalRecords = totalRecords;
      },
    });
    this.cdr.detectChanges();
  }

  onViewRelatedUsers(meetingId: number) {
    localStorage.setItem('current-meeting-id', meetingId.toString());
    this.router.navigate(['user', 'projects', 'meetings', 'meeting-users']);
  }

  onBackToProjects() {
    localStorage.removeItem('current-project-key');
    localStorage.removeItem('current-project-title');
    this.router.navigate(['user/projects']);
  }

  onChangePage(event: TablePageEvent) {
    this.page = event.first / event.rows + 1;
  }

  onLazyLoad() {
    this.loading = true;
    setTimeout(() => {
      this.meetingService
        .getCurrentUserMeetings(this.projectKey, this.page, this.offset)
        .subscribe({
          next: (meetings: MeetingResponse[]) => {
            this.currentUserMeetings = meetings;
          },
          error: (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: error.error.message,
              detail: 'via admin',
            });
          },
        });
      this.sizeService.getCurrentUserMeetingsSize(this.projectKey).subscribe({
        next: (totalRecords: number) => {
          this.totalRecords = totalRecords;
        },
      });
      this.loading = false;
    }, 600);
    this.cdr.detectChanges();
  }
}
