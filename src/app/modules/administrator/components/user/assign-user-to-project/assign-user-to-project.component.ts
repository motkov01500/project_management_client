import { Component, OnInit } from '@angular/core';
import { ProjectResponse, UserResponse, UserRole } from '../../../../../models';
import { UsersService } from '../../../../../services/users.service';
import { ProjectsService } from '../../../../../services/projects.service';
import { ProjectUserAssign } from '../../../../../models/project/project-user-assign';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { WebSocketService } from '../../../../../services/web-socket.service';

@Component({
  selector: 'app-assign-user-to-project',
  templateUrl: './assign-user-to-project.component.html',
  styleUrl: './assign-user-to-project.component.css',
})
export class AssignUserToProjectComponent implements OnInit {
  assignUserToProject: ProjectUserAssign = { projectId: 0, userId: 0 };
  selectedProject: ProjectResponse = {
    key: '',
    title: '',
    id: 0,
    isUsersAvailable: true,
  };
  projects: ProjectResponse[] = [];
  items: UserResponse[] = [];
  visibleSidebar: boolean = false;
  role: UserRole = { name: '' };
  userDetails: UserResponse = {
    id: 0,
    username: '',
    fullName: '',
    role: this.role,
    imageUrl: '',
  };

  constructor(
    private userService: UsersService,
    private projectService: ProjectsService,
    private messageService: MessageService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.userService.getUnassignedToProjectUsers().subscribe({
      next: (users: UserResponse[]) => {
        this.items = users;
      },
    });
  }

  onAssign(userId: number) {
    this.visibleSidebar = true;
    this.assignUserToProject.userId = userId;
    this.projectService.getAllProjectsWithoutPaging().subscribe({
      next: (projects: ProjectResponse[]) => {
        this.projects = projects;
      },
    });
  }

  onSubmit() {
    this.assignUserToProject.projectId = this.selectedProject.id;
    this.visibleSidebar = false;
    this.projectService
      .assignUserToProject(
        this.assignUserToProject.userId,
        this.assignUserToProject.projectId
      )
      .subscribe({
        next: (response: any) => {
          this.items = this.items.filter(
            (item) => item.id != this.assignUserToProject.userId
          );
          this.messageService.add({
            severity: 'success',
            summary: response.message,
          });
          this.webSocketService.sendMessage(`The user is added to project.`);
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
