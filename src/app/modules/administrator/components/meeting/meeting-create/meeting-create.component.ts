import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MeetingCreate, ProjectResponse } from 'app/models';
import {
  MeetingsService,
  ProjectsService,
  WebSocketService,
} from 'app/services';

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
  calendarVal: string | undefined;

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
      title: this.title ? this.title : '',
      date: this.calendarVal ? this.calendarVal : '',
      projectId: this.selectedProject?.id,
    };
    this.meetingService.create(newMeeting).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Meeting created',
          detail: 'via admin',
        });
        this.router.navigate(['administrator', 'projects', 'meetings']);
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

  onSelectDate(event: any) {
    this.calendarVal = event.toISOString();
  }
}
