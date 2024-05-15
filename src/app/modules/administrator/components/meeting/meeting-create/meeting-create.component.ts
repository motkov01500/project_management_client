import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectsService } from '../../../../../services/projects.service';
import { MeetingsService } from '../../../../../services/meetings.service';
import { ProjectResponse } from '../../../../../models';
import { MeetingCreate } from '../../../../../models/meeting/meeting-create';
import { MessageService } from 'primeng/api';
import { WebSocketService } from '../../../../../services/web-socket.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MeetingResponse } from '../../../../../models/meeting/meeting-response';

@Component({
  selector: 'app-meeting-create',
  templateUrl: './meeting-create.component.html',
  styleUrl: './meeting-create.component.css',
})
export class MeetingCreateComponent implements OnInit {
  selectedStatus: string = '';
  date: Date = new Date();
  statuses: string[] = ['UPCOMING', 'STARTED', 'END'];
  projectTitle: string | null = localStorage.getItem('current-project-title');
  projectKey: string | null = localStorage.getItem('current-project-key');
  selectedProject: ProjectResponse | undefined;
  projects: ProjectResponse[] = [];
  title: string = '';

  constructor(
    private projectService: ProjectsService,
    private router: Router,
    private meetingService: MeetingsService,
    private messageService: MessageService,
    private websocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.projectService.getAllProjectsWithoutPaging().subscribe({
      next: (projects: ProjectResponse[]) => {
        this.projects = projects;
      },
    });
    this.projectService.getProjectByKey(this.projectKey).subscribe({
      next: (project: ProjectResponse) => {
        this.selectedProject = project;
      },
    });
  }
  onSubmit() {
    let newMeeting: MeetingCreate = {
      title: this.title,
      date: this.date,
      projectId: this.selectedProject?.id,
    };
    this.meetingService.create(newMeeting).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Meeting created',
          detail: 'via admin',
        });
        this.websocketService.sendMessage(`New meeting is created`);
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
  onHomeButton() {
    this.router.navigate(['administrator']);
  }
}
