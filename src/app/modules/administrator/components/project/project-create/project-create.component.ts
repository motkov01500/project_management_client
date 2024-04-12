import { Component } from '@angular/core';
import { ProjectsService } from '../../../../../services/projects.service';
import { ProjecRequest } from '../../../../../models/project/project-request';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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
    private messageService: MessageService
  ) {}

  onSubmit() {
    this.service.createProject(this.newProject).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Project created',
          detail: 'via admin',
        });
      },
    });
  }
}
