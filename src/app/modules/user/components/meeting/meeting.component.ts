import { Component, OnInit } from '@angular/core';
import { MeetingResponse } from '../../../../models/meeting/meeting-response';
import { MeetingsService } from '../../../../services/meetings.service';
import { UserResponse } from '../../../../models';
import { UsersService } from '../../../../services/users.service';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.css',
})
export class MeetingComponent implements OnInit {
  currentUserMeetings: MeetingResponse[] = [];
  viewUserRelatedSidebar: boolean = false;
  meetingRelatedUsers: UserResponse[] = [];

  constructor(
    private meetingService: MeetingsService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.meetingService.getCurrentUserMeetings().subscribe({
      next: (meetings: MeetingResponse[]) => {
        this.currentUserMeetings = meetings;
      },
    });
  }

  onViewRelatedUsers(meetingId: number) {
    this.viewUserRelatedSidebar = true;
    this.userService.getRelatedToMeeting(meetingId).subscribe({
      next: (users: UserResponse[]) => {
        this.meetingRelatedUsers = users;
      },
    });
  }
}
