import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TablePageEvent } from 'primeng/table';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectResponse, UserResponse } from 'app/models';
import {
  AuthService,
  ProjectsService,
  SizeService,
  UsersService,
} from 'app/services';

@Component({
  selector: 'app-user-project-related',
  templateUrl: './user-project-related.component.html',
  styleUrl: './user-project-related.component.css',
})
export class UserProjectRelatedComponent implements OnInit {
  visibleSidebarAssignToProject: boolean = false;
  usersToAssign: UserResponse[] = [];
  selectedUserToAssign: UserResponse | undefined;
  items: UserResponse[] = [];
  projectKey: string | null = localStorage.getItem('current-project-key');
  projectTitle: string | null = localStorage.getItem('current-project-title');
  userRole: string | null = this.authService.getRole();
  loading: boolean | undefined;
  totalRecords: number = 1;
  page: number = 1;
  currentProject: ProjectResponse | undefined;
  offset: number = 5; //default
  selectedUsers: number[] = [];

  constructor(
    private userService: UsersService,
    private sizeService: SizeService,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private projectService: ProjectsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sizeService.getRelatedToProjectSize(this.projectKey).subscribe({
      next: (totalRecords: number) => {
        this.totalRecords = totalRecords;
      },
    });
    this.cdr.detectChanges();
  }

  onUnAssignUser(userId: number) {
    this.projectService
      .removeUserFromProject(userId, this.projectKey)
      .subscribe({
        next: (message: string) => {
          this.items = this.items.filter((item) => item.id != userId);
          this.messageService.add({
            severity: 'success',
            summary: 'User was removed from project.',
            detail: 'via admin',
          });
        },
      });
    this.onLazyLoad();
  }

  onChangePage(event: TablePageEvent) {
    this.page = event.first / event.rows + 1;
  }

  onLazyLoad() {
    this.loading = true;
    setTimeout(() => {
      this.userService
        .getRelatedToProject(this.projectKey, this.page, this.offset)
        .subscribe({
          next: (users: UserResponse[]) => {
            this.items = users;
          },
        });
      this.sizeService.getRelatedToProjectSize(this.projectKey).subscribe({
        next: (totalRecords: number) => {
          this.totalRecords = totalRecords;
        },
      });
      this.loading = false;
    }, 600);
    this.cdr.detectChanges();
  }

  onAssignUserToProject() {
    this.projectService.getProjectByKey(this.projectKey).subscribe({
      next: (project: ProjectResponse) => {
        this.currentProject = project;
      },
    });
    this.userService.getUsersThatCanAddToProject(this.projectKey).subscribe({
      next: (users: UserResponse[]) => {
        this.usersToAssign = users;
        this.visibleSidebarAssignToProject = true;
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

  onAssignUserToProjectSubmit() {
    this.projectService
      .assignUserToProject(this.selectedUsers, this.currentProject?.id)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'User successfully added to project.',
            detail: 'via admin',
          });
          this.visibleSidebarAssignToProject = false;
          this.onLazyLoad();
        },
      });
  }
}
