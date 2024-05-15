import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserResponse } from '../../../../models';
import { MeetingsService } from '../../../../services/meetings.service';
import { UsersService } from '../../../../services/users.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { MeetingResponse } from '../../../../models/meeting/meeting-response';
import { TableLazyLoadEvent, TablePageEvent } from 'primeng/table';
import { SizeService } from '../../../../services/size.service';

@Component({
  selector: 'app-user-meeting-related',
  templateUrl: './user-meeting-related.component.html',
  styleUrl: './user-meeting-related.component.css',
})
export class UserMeetingRelatedComponent implements OnInit {
  totalRecords: number = 0;
  items: UserResponse[] = [];
  currentMeetingId: string | null = localStorage.getItem('current-meeting-id');
  userRole: string | null = this.authService.getRole();
  currentMeeting: MeetingResponse | undefined;
  loading: boolean = false;
  offset: number = 5;
  currentPage: number = 1;

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
  }

  onChangePage(event: TablePageEvent) {
    this.currentPage = event.first / event.rows + 1;
  }

  onLazyLoad($event: TableLazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
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
      this.loading = false;
    }, 600);
  }
}
