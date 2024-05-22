import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, SortEvent } from 'primeng/api';
import { TablePageEvent } from 'primeng/table';
import { HttpErrorResponse } from '@angular/common/http';
import { TaskResponse, UserResponse } from 'app/models';
import {
  AuthService,
  SizeService,
  TasksService,
  UsersService,
} from 'app/services';

@Component({
  selector: 'app-user-task-related',
  templateUrl: './user-task-related.component.html',
  styleUrl: './user-task-related.component.css',
})
export class UserTaskRelatedComponent implements OnInit {
  taskDetails: TaskResponse | undefined;
  assignToTaskSidebar: any;
  usersToAssign: UserResponse[] = [];
  totalRecords: number = 1;
  loading: boolean = false;
  page: number = 1;
  offset: number = 5;
  items: UserResponse[] = [];
  projectKey: string | null = localStorage.getItem('current-project-key');
  userRole: string | null = this.authService.getRole();
  taskId: any = localStorage.getItem('current-task-id');
  currentTask: TaskResponse | undefined;
  selectedUsers: any;
  sortColumn?: string = '';
  sortOrder?: string = '';

  constructor(
    private userService: UsersService,
    private sizeService: SizeService,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private taskService: TasksService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cdr.detectChanges();
  }

  onUnAssignUser(userId: number) {
    this.taskService.removeUserFromTask(userId, this.taskId).subscribe({
      next: (message: string) => {
        this.items = this.items.filter((item) => item.id != userId);
        this.messageService.add({
          severity: 'success',
          summary: 'User was removed from task.',
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
      this.taskService.getById(this.taskId).subscribe({
        next: (currentTask: TaskResponse) => {
          this.currentTask = currentTask;
        },
      });
      this.userService
        .getRelatedToTask(
          this.taskId,
          this.page,
          this.offset,
          this.sortColumn,
          this.sortOrder
        )
        .subscribe({
          next: (users: UserResponse[]) => {
            this.items = users;
          },
        });
      this.sizeService.getUsersRelatedToTaskSize(this.taskId).subscribe({
        next: (totalRecords: number) => {
          this.totalRecords = totalRecords;
        },
      });
      this.loading = false;
    }, 600);
    this.cdr.detectChanges();
  }

  onAssignToTask() {
    this.taskService.getById(this.currentTask?.id).subscribe({
      next: (task: TaskResponse) => {
        this.taskDetails = task;
      },
    });
    this.userService.getUsersThatCanAddToTask(this.currentTask?.id).subscribe({
      next: (users: UserResponse[]) => {
        this.usersToAssign = users;
        this.assignToTaskSidebar = true;
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

  onSubmitAssignToTask() {
    this.taskService
      .assignUserToTask(this.selectedUsers, this.currentTask?.id)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'User assigned to task.',
            detail: 'via admin',
          });
          this.assignToTaskSidebar = false;
          this.onLazyLoad();
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

  customSort(event: SortEvent) {
    this.sortColumn = event.field;
    this.sortOrder = event.order == 1 ? 'ascending' : 'descending';
    this.onLazyLoad();
  }
}
