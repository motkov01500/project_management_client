import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TablePageEvent } from 'primeng/table';
import { TaskEdit, TaskResponse, UserResponse } from 'app/models';
import {
  SizeService,
  TasksService,
  UsersService,
  WebSocketService,
} from 'app/services';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  items: TaskResponse[] = [];
  visibleSidebar: boolean = false;
  taskDetails: TaskResponse = {
    id: 0,
    title: 'test',
  };
  editedTask: TaskEdit = {
    hoursSpent: 0,
    progress: 0,
    title: '',
  };
  projectKey: string | null = localStorage.getItem('current-project-key');
  projectTitle: string | null = localStorage.getItem('current-project-title');
  assignToTaskSidebar: boolean = false;
  users: UserResponse[] = [];
  selectedUser: string = '';
  haveUsers: boolean = true;
  totalRecords: number = 1;
  loading: boolean = false;
  page: number = 1;
  offset: number = 5;
  sortColumn?: string = '';
  sortOrder?: string = '';

  constructor(
    private service: TasksService,
    private userService: UsersService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private messageService: MessageService,
    private websocketService: WebSocketService,
    private sizeService: SizeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sizeService.getCurrentProjectTasksSize(this.projectKey).subscribe({
      next: (totalRecords: number) => {
        this.totalRecords = totalRecords;
      },
    });
    this.cdr.detectChanges();
  }

  onSubmit() {
    let itemIndex: number = this.items.findIndex(
      (item) => item.id == this.taskDetails.id
    );
    this.service.edit(this.taskDetails?.id, this.editedTask).subscribe({
      next: (task: TaskResponse) => {
        this.items[itemIndex] = task;
        this.messageService.add({
          severity: 'success',
          summary: 'Task edited',
          detail: 'via admin',
        });
        this.websocketService.sendMessage(`The task is successfully edited.`);
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error.message,
          detail: 'via admin',
        });
      },
    });
    this.visibleSidebar = false;
  }

  onEdit(taskId: number) {
    this.visibleSidebar = true;
    this.service.getById(taskId).subscribe({
      next: (task: TaskResponse) => {
        this.taskDetails = task;
      },
    });
  }

  onDelete(taskId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      accept: () => {
        this.service.delete(taskId).subscribe({
          error: (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: error.error.message,
              detail: 'via admin',
            });
          },
        });
        this.items = this.items.filter((item) => item.id != taskId);
        this.messageService.add({
          severity: 'success',
          summary: 'Task Deleted',
          detail: 'via admin',
        });
        this.websocketService.sendMessage(`Task is deleted.`);
        this.onLazyLoad();
      },
      reject: () => {
        this.confirmationService.close();
      },
      key: 'positionDialog',
    });
  }

  onBackToProjects() {
    localStorage.removeItem('current-project-key');
    localStorage.removeItem('current-project-title');
    this.router.navigate(['administrator/project/get-all']);
  }

  onCreateTask() {
    this.router.navigate(['administrator', 'projects', 'tasks', 'create']);
  }

  onAssignToTask(taskId: number) {
    this.service.getById(taskId).subscribe({
      next: (task: TaskResponse) => {
        this.taskDetails = task;
      },
    });
    this.userService.getUsersThatCanAddToTask(taskId).subscribe({
      next: (users: UserResponse[]) => {
        this.users = users;
        this.haveUsers = true;
        this.assignToTaskSidebar = true;
      },
      error: (error: HttpErrorResponse) => {
        this.haveUsers = false;
        this.messageService.add({
          severity: 'error',
          summary: error.error.message,
          detail: 'via admin',
        });
      },
    });
  }

  onSubmitAssignToTask() {
    this.service
      .assignUserToTask(this.selectedUser, this.taskDetails.id)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'User assigned to task.',
            detail: 'via admin',
          });
          this.assignToTaskSidebar = false;
          if (this.users.length == 0) this.haveUsers = !this.haveUsers;
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: error.error.message,
            detail: 'via admin',
          });
        },
      });
    this.userService.getUsersThatCanAddToTask(this.taskDetails.id).subscribe({
      next: (users: UserResponse[]) => {
        if (users.length == 0) {
          this.haveUsers = false;
        }
      },
      error: () => {},
    });
  }
  onViewUsers(taskId: string) {
    localStorage.setItem('current-task-id', taskId.toString());
    this.router.navigate(['administrator', 'projects', 'tasks', 'users']);
  }

  onChangePage(event: TablePageEvent) {
    this.page = event.first / event.rows + 1;
  }

  onLazyLoad() {
    this.loading = true;
    setTimeout(() => {
      this.service
        .getCurrentProjectTasks(
          this.projectKey,
          this.page,
          this.offset,
          this.sortColumn,
          this.sortOrder
        )
        .subscribe({
          next: (tasks: TaskResponse[]) => {
            this.items = tasks;
          },
        });
      this.sizeService.getCurrentProjectTasksSize(this.projectKey).subscribe({
        next: (totalRecords: number) => {
          this.totalRecords = totalRecords;
        },
      });
      this.loading = false;
    }, 600);
    this.cdr.detectChanges();
  }

  customSort(event: SortEvent) {
    this.sortColumn = event.field;
    this.sortOrder = event.order == 1 ? 'ascending' : 'descending';
    this.onLazyLoad();
  }
}
