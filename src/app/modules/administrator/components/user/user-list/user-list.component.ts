import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TablePageEvent } from 'primeng/table';
import { ProjectResponse, UserEdit, UserResponse } from 'app/models';
import {
  ProjectsService,
  SizeService,
  UsersService,
  WebSocketService,
} from 'app/services';

@Component({
  selector: 'app-users',
  templateUrl: './user-list.component.html',
  styleUrl: './users.component.css',
})
export class UserListComponent implements OnInit {
  totalRecords: number = 1;
  loading: boolean = false;
  page: number = 1;
  offset: number = 5;
  items: UserResponse[] = [];
  visibleSidebar: boolean = false;
  userDetails: UserResponse | any;
  projects: ProjectResponse[] = [];
  selectedProject: number = 0;
  roles: string[] = ['user', 'administrator'];
  selectedRole: string = '';
  username: string = '';
  password: string = '';
  fullName: string = '';
  visibleSidebarAssignToProject: boolean = false;
  assignToMeetingSidebar: boolean = false;
  meetings: any[] | undefined;

  constructor(
    private service: UsersService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private sizeService: SizeService,
    private messageService: MessageService,
    private webSocketService: WebSocketService,
    private projectService: ProjectsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.service.getAllUsers(this.page, this.offset).subscribe({
    //   next: (data: UserResponse[]) => {
    //     this.items = data;
    //   },
    // });
    this.sizeService.getAllUsersSize().subscribe({
      next: (totalRecords: number) => {
        this.totalRecords = totalRecords;
      },
    });

    this.cdr.detectChanges();
  }

  onDelete(event: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      accept: () => {
        this.service.deleteUser(event).subscribe({
          error: (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: error.error.message,
              detail: 'via admin',
            });
          },
        });
        this.messageService.add({
          severity: 'success',
          summary: 'User deleted',
          detail: 'via admin',
        });
        this.onLazyLoad();
        this.webSocketService.sendMessage(`The user is deleted`);
      },
      reject: () => {
        this.confirmationService.close();
      },
      key: 'positionDialog',
    });
  }

  onEdit(userId: number) {
    this.visibleSidebar = true;
    this.service.getById(userId).subscribe({
      next: (user: UserResponse) => {
        this.userDetails = user;
      },
    });
  }

  onSubmit() {
    let updatedUser: UserEdit = {
      username: this.username ? this.username : '',
      password: this.password ? this.password : '',
      fullName: this.fullName ? this.fullName : '',
      role: this.selectedRole ? this.selectedRole : '',
    };
    let itemIndex: number = this.items.findIndex(
      (item) => item.username == this.userDetails.username
    );
    this.service.editUser(updatedUser, this.userDetails.id).subscribe({
      next: (user: UserResponse) => {
        this.items[itemIndex] = user;
        this.messageService.add({
          severity: 'success',
          summary: 'User Edited',
          detail: 'via admin',
        });
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error.message,
          detail: 'via admin',
        });
      },
    });
    this.webSocketService.sendMessage(`User is Edited`);
    this.visibleSidebar = false;
  }

  onAssignProject(userId: number) {
    this.service.getById(userId).subscribe({
      next: (user: UserResponse) => {
        this.userDetails = user;
      },
    });
    this.projectService.getAllProjectsWithoutPaging().subscribe({
      next: (projects: ProjectResponse[]) => {
        this.projects = projects;
      },
    });
    this.visibleSidebarAssignToProject = true;
  }

  onCreateUser() {
    this.router.navigate(['administrator', 'user', 'create']);
  }

  onHomeButton() {
    this.router.navigate(['administrator']);
  }

  onAssignToMeeting(arg0: any) {
    this.assignToMeetingSidebar = true;
  }

  onChangePage(event: TablePageEvent) {
    this.page = event.first / event.rows + 1;
  }

  onLazyLoad() {
    this.loading = true;
    setTimeout(() => {
      this.service.getAllUsers(this.page, this.offset).subscribe({
        next: (data: UserResponse[]) => {
          this.items = data;
        },
      });
      this.sizeService.getAllUsersSize().subscribe({
        next: (totalRecords: number) => {
          this.totalRecords = totalRecords;
        },
      });
      this.loading = false;
    }, 600);
    this.cdr.detectChanges();
  }
}
