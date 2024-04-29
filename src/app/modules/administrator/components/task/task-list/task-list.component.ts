import { Component, OnInit } from '@angular/core';
import { TaskResponse } from '../../../../../models/task/task-response';
import { TasksService } from '../../../../../services/tasks.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TaskEdit } from '../../../../../models/task/task-edit';
import { WebSocketService } from '../../../../../services/web-socket.service';
import { TaskStatus } from '../../../../../models';
import { TaskStatusService } from '../../../../../services/task-status.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  items: TaskResponse[] = [];
  visibleSidebar: boolean = false;
  taskDetails: TaskResponse | any;
  statuses: TaskStatus[] = [];
  editedTask: TaskEdit = {
    hoursSpent: 0,
    status: '',
    progress: 0,
  };

  constructor(
    private service: TasksService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private websocketService: WebSocketService,
    private taskStatusService: TaskStatusService
  ) {}

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (tasks: TaskResponse[]) => {
        this.items = tasks;
      },
    });
    this.taskStatusService.findAll().subscribe({
      next: (data: TaskStatus[]) => {
        this.statuses = data;
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
}
