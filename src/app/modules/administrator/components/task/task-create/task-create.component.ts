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
    status: '',
    projectId: 0,
    initialEstimation: 0,
  };
  selectedProject: ProjectResponse = { key: '', title: '', id: 0 };
  projects: ProjectResponse[] = [];
  statuses: string[] = ['TODO', 'IN_PROGRESS', 'DONE', 'OPEN', 'RE_OPEN'];

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
  }

  onSubmit() {
    this.newTask.projectId = this.selectedProject.id;
    this.tasksService.create(this.newTask).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Task created',
          detail: 'via admin',
        });
        this.websocketService.sendMessage(`New task is created`);
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'success',
          summary: error.error.message,
          detail: 'via admin',
        });
      },
    });
  }
}
