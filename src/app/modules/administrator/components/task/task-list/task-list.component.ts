import { Component, OnInit } from '@angular/core';
import { TaskResponse } from '../../../../../models/task/task-response';
import { TasksService } from '../../../../../services/tasks.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TaskEdit } from '../../../../../models/task/task-edit';
import { WebSocketService } from '../../../../../services/web-socket.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserResponse } from '../../../../../models';
import { UsersService } from '../../../../../services/users.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  items: TaskResponse[] = [];
  visibleSidebar: boolean = false;
  taskDetails: TaskResponse | any;
  editedTask: TaskEdit = {
    hoursSpent: 0,
    progress: 0,
  };
  projectKey: string | null = localStorage.getItem('current-project-key');
  projectTitle: string | null = localStorage.getItem('current-project-title');
  assignToTaskSidebar: boolean = false;
  users: UserResponse[] = [];
  selectedUser: string = '';
  haveUsers: boolean = true;

  constructor(
    private service: TasksService,
    private userService: UsersService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private messageService: MessageService,
    private websocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.service.getCurrentProjectTasks(this.projectKey).subscribe({
      next: (tasks: TaskResponse[]) => {
        this.items = tasks;
      },
    });
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
          severity: 'success',
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
        this.assignToTaskSidebar = true;
      },
    });
    this.userService.getUsersThatCanAddToTask(taskId).subscribe({
      next: (users: UserResponse[]) => {
        this.users = users;
        this.haveUsers = true;
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
}
