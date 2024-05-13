import { Component, OnInit } from '@angular/core';
import { UserResponse } from '../../../../models';
import { MeetingsService } from '../../../../services/meetings.service';
import { UsersService } from '../../../../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-meeting-related',
  templateUrl: './user-meeting-related.component.html',
  styleUrl: './user-meeting-related.component.css',
})
export class UserMeetingRelatedComponent implements OnInit {
  items: UserResponse[] = [];
  currentMeetingId: string | null = localStorage.getItem('current-meeting-id');

  constructor(
    private meetingService: MeetingsService,
    private router: Router,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.userService
      .getRelatedToMeeting(Number(this.currentMeetingId))
      .subscribe({
        next: (users: UserResponse[]) => {
          this.items = users;
        },
      });
  }

  onHomeButton() {
    this.router.navigate(['user', 'projects', 'meetings']);
  }
}
