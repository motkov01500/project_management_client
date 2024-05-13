import { Component, OnInit } from '@angular/core';
import { TaskCreate } from '../../../../../models/task/task-create';
import { ProjectResponse } from '../../../../../models';
import { ProjectsService } from '../../../../../services/projects.service';
import { TasksService } from '../../../../../services/tasks.service';
import { MessageService } from 'primeng/api';
import { WebSocketService } from '../../../../../services/web-socket.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.css',
})
export class TaskCreateComponent implements OnInit {
  newTask: TaskCreate = {
    projectId: 0,
    initialEstimation: 0,
  };
  selectedProject: ProjectResponse = { key: '', title: '', id: 0 };
  projects: ProjectResponse[] = [];
  projectKey: string | null = localStorage.getItem('current-project-key');
  currentProject: ProjectResponse | undefined;
  constructor(
    private projectService: ProjectsService,
    private tasksService: TasksService,
    private messageService: MessageService,
    private websocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects: ProjectResponse[]) => {
        this.projects = projects;
      },
    });
    this.projectService.getProjectByKey(this.projectKey).subscribe({
      next: (project: ProjectResponse) => {
        this.currentProject = project;
        this.newTask.projectId = project.id;
        console.log(this.currentProject);
      },
    });
  }

  onSubmit() {
    this.tasksService.create(this.newTask).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Task created',
          detail: 'via admin',
        });
        console.log();
        this.websocketService.sendMessage(`New task is created`);
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
}
