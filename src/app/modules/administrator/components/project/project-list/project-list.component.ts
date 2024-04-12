import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectEdit, ProjectResponse } from '../../../../../models';
import { ProjectsService } from '../../../../../services/projects.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MeetingResponse } from '../../../../../models/meeting/meeting-response';
import { MeetingsService } from '../../../../../services/meetings.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css',
})
export class ProjectListComponent implements OnInit {
  items: ProjectResponse[] = [];
  projectEditSideBar: boolean = false;
  projectMeetingSidebar: boolean = false;
  projectDetails: ProjectResponse | undefined;
  currentProjectUnfinishedMeetings: MeetingResponse[] = [];
  title: string = '';
  key: string = '';

  constructor(
    private projectService: ProjectsService,
    private confirmationService: ConfirmationService,
    private meetingService: MeetingsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data: ProjectResponse[]) => {
        this.items = [...data];
      },
    });
  }

  onEdit(projectId: number) {
    this.projectService.getById(projectId).subscribe({
      next: (project: ProjectResponse) => {
        this.projectDetails = project;
      },
    });
    this.projectEditSideBar = true;
  }

  onSubmit(projectId: any) {
    let editedProject: ProjectEdit = {
      key: this.key,
      title: this.title,
    };
    let itemIndex: number = this.items.findIndex(
      (item) => item.key == this.projectDetails?.key
    );

    this.projectService.editProject(editedProject, projectId).subscribe({
      next: (project: ProjectResponse) => {
        this.items[itemIndex] = project;
        this.messageService.add({
          severity: 'success',
          summary: 'Project Edit',
          detail: 'via admin',
        });
      },
    });
    this.projectEditSideBar = false;
  }

  onDelete(projectId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      accept: () => {
        this.projectService.deleteProject(projectId).subscribe({});
        this.items = this.items.filter((item) => item.id != projectId);
        this.messageService.add({
          severity: 'success',
          summary: 'Project Delete',
          detail: 'via admin',
        });
      },
      reject: () => {
        this.confirmationService.close();
      },
      key: 'positionDialog',
    });
  }

  onViewMeetings(projectKey: string) {
    this.projectMeetingSidebar = true;
    this.meetingService.getUnfinishedMeetings(projectKey).subscribe({
      next: (meeetings: MeetingResponse[]) => {
        this.currentProjectUnfinishedMeetings = meeetings;
      },
    });
  }
}
