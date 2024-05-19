import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjecRequest } from 'app/models';
import { ProjectsService, WebSocketService } from 'app/services';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.css',
})
export class ProjectCreateComponent {
  newProject: ProjecRequest = {
    title: '',
    key: '',
  };

  constructor(
    private service: ProjectsService,
    private router: Router,
    private messageService: MessageService,
    private websocketService: WebSocketService
  ) {}

  onSubmit() {
    this.service.createProject(this.newProject).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Project created',
          detail: 'via admin',
        });
        this.websocketService.sendMessage(`New project is created`);
        this.router.navigate(['administrator', 'project', 'get-all']);
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
