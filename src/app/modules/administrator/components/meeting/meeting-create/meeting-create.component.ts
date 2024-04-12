import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../../../services/projects.service';
import { MeetingsService } from '../../../../../services/meetings.service';
import { ProjectResponse } from '../../../../../models';
import { MeetingCreate } from '../../../../../models/meeting/meeting-create';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-meeting-create',
  templateUrl: './meeting-create.component.html',
  styleUrl: './meeting-create.component.css',
})
export class MeetingCreateComponent implements OnInit {
  selectedStatus: string = '';
  date: Date = new Date();
  statuses: string[] = ['UPCOMING', 'STARTED', 'END'];
  selectedProject: ProjectResponse = {
    id: 0,
    title: '',
    key: '',
  };
  projects: ProjectResponse[] = [];

  constructor(
    private projectService: ProjectsService,
    private meetingService: MeetingsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects: ProjectResponse[]) => {
        this.projects = projects;
      },
    });
  }

  onSubmit() {
    let newMeeting: MeetingCreate = {
      status: this.selectedStatus,
      date: this.date,
      projectId: this.selectedProject.id,
    };
    this.meetingService.create(newMeeting).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Meeting created',
          detail: 'via admin',
        });
      },
    });
  }
}
