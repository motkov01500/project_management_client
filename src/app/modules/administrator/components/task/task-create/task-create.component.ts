import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProjectResponse, TaskCreate } from 'app/models';
import { ProjectsService, TasksService, WebSocketService } from 'app/services';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.css',
})
export class TaskCreateComponent implements OnInit {
  newTask: TaskCreate = {
    projectId: 0,
    initialEstimation: 0,
    title: '',
  };
  selectedProject: ProjectResponse = {
    key: '',
    title: '',
    id: 0,
  };
  projects: ProjectResponse[] = [];
  projectKey: string | null = localStorage.getItem('current-project-key');
  projectTitle: string | null = localStorage.getItem('current-project-title');
  currentProject: ProjectResponse | undefined;
  constructor(
    private projectService: ProjectsService,
    private tasksService: TasksService,
    private messageService: MessageService,
    private websocketService: WebSocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectService.getAllProjectsWithoutPaging().subscribe({
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
        this.router.navigate(['administrator', 'projects', 'tasks']);
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
