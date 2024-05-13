import { Component, OnInit } from '@angular/core';
import { MeetingResponse } from '../../../../models/meeting/meeting-response';
import { MeetingsService } from '../../../../services/meetings.service';
import { UserResponse } from '../../../../models';
import { UsersService } from '../../../../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.css',
})
export class MeetingComponent implements OnInit {
  currentUserMeetings: MeetingResponse[] = [];
  viewUserRelatedSidebar: boolean = false;
  meetingRelatedUsers: UserResponse[] = [];
  projectKey: string | null = localStorage.getItem('current-project-key');
  projectTitle: string | null = localStorage.getItem('current-project-title');

  constructor(
    private meetingService: MeetingsService,
    private userService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.meetingService.getCurrentUserMeetings(this.projectKey).subscribe({
      next: (meetings: MeetingResponse[]) => {
        this.currentUserMeetings = meetings;
      },
    });
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
}
