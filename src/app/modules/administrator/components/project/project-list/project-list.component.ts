import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  MeetingResponse,
  ProjectEdit,
  ProjectResponse,
  UserResponse,
} from 'app/models';
import { Router } from '@angular/router';
import { TableLazyLoadEvent, TablePageEvent } from 'primeng/table';
import {
  ProjectsService,
  SizeService,
  UsersService,
  WebSocketService,
} from 'app/services';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css',
})
export class ProjectListComponent implements OnInit {
  visibleSidebarAssignUserToProject: any;
  visibleSidebarAssignToProject: any;
  items: ProjectResponse[] = [];
  projectEditSideBar: boolean = false;
  projectMeetingSidebar: boolean = false;
  projectDetails: ProjectResponse | undefined;
  currentProjectUnfinishedMeetings: MeetingResponse[] = [];
  title: string = '';
  key: string = '';
  usersToAssign: UserResponse[] = [];
  selectedUserToAssign: UserResponse | undefined;
  currentProjectUserAssign: ProjectResponse | undefined;
  offset: number = 5;
  totalRecords: number = 1;
  loading: boolean = false;
  page: number = 1;

  constructor(
    private projectService: ProjectsService,
    private confirmationService: ConfirmationService,
    private sizeService: SizeService,
    private userService: UsersService,
    private router: Router,
    private messageService: MessageService,
    private websocketService: WebSocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sizeService.getAllProjectsSize().subscribe({
      next: (totalRecords: number) => {
        this.totalRecords = totalRecords;
      },
    });
    this.cdr.detectChanges();
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
      key: this.key ? this.key : '',
      title: this.title ? this.title : '',
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
        this.websocketService.sendMessage(`The project is edited`);
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error.message,
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
        this.projectService.deleteProject(projectId).subscribe({
          error: (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: error.error.message,
              detail: 'via admin',
            });
          },
        });
        this.items = this.items.filter((item) => item.id != projectId);
        this.messageService.add({
          severity: 'success',
          summary: 'Project Delete',
          detail: 'via admin',
        });
        this.websocketService.sendMessage(`Project is deleted`);
        this.onLazyLoad();
      },
      reject: () => {
        this.confirmationService.close();
      },
      key: 'positionDialog',
    });
  }

  onViewMeetings(projectKey: string, projectTitle: string) {
    localStorage.setItem('current-project-key', projectKey);
    localStorage.setItem('current-project-title', projectTitle);
    this.router.navigate(['administrator', 'projects', 'meetings']);
  }

  onViewTasks(projectKey: string, projectTitle: string) {
    localStorage.setItem('current-project-key', projectKey);
    localStorage.setItem('current-project-title', projectTitle);
    this.router.navigate(['administrator', 'projects', 'tasks']);
  }

  onHomeButton() {
    this.router.navigate(['administrator']);
  }

  onCreateProject() {
    this.router.navigate(['administrator', 'project', 'create']);
  }

  onViewUsers(projectKey: string, projectTitle: string) {
    localStorage.setItem('current-project-key', projectKey);
    localStorage.setItem('current-project-title', projectTitle);
    this.router.navigate(['administrator', 'projects', 'users']);
  }

  onAssignUserToProject(projectKey: string, projectTitle: string) {
    this.projectService.getProjectByKey(projectKey).subscribe({
      next: (project: ProjectResponse) => {
        this.currentProjectUserAssign = project;
      },
    });
    this.userService.getUsersThatCanAddToProject(projectKey).subscribe({
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
      .assignUserToProject(
        this.selectedUserToAssign?.id,
        this.currentProjectUserAssign?.id
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'User successfully added to project.',
            detail: 'via admin',
          });
          this.visibleSidebarAssignToProject = false;
        },
      });
  }

  onChangePage(event: TablePageEvent) {
    this.page = event.first / event.rows + 1;
  }

  onLazyLoad() {
    this.loading = true;
    setTimeout(() => {
      this.projectService.getAllProjects(this.page, this.offset).subscribe({
        next: (data: ProjectResponse[]) => {
          this.items = [...data];
        },
      });
      this.sizeService.getAllProjectsSize().subscribe({
        next: (totalRecords: number) => {
          this.totalRecords = totalRecords;
        },
      });
      this.loading = false;
    }, 600);
    this.cdr.detectChanges();
  }
}
