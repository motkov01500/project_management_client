import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../../../services/tasks.service';
import { TaskResponse } from '../../../../models/task/task-response';
import { TaskProgress } from '../../../../models/task/task-update-progress';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements OnInit {
  items: TaskResponse[] = [];
  newProgress: TaskProgress = {
    progress: 0,
  };
  isDisabled: boolean = false;
  taskDetails: TaskResponse = {
    id: 0,
    title: '',
  };
  visibleSidebar: boolean = false;
  colorTaskStatusName: string = '';
  projectKey: string | null = localStorage.getItem('current-project-key');
  projectTitle: string | null = localStorage.getItem('current-project-title');

  constructor(
    private taskService: TasksService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskService.getCurrentUserRelatedTasks(this.projectKey).subscribe({
      next: (tasks: TaskResponse[]) => {
        this.items = tasks;
      },
    });
    this.colorTaskStatusName = 'red';
  }

  onUpdateProgress(taskId: number) {
    this.visibleSidebar = true;
    this.taskService.getById(taskId).subscribe({
      next: (task: TaskResponse) => {
        this.taskDetails = task;
      },
    });
  }

  onSubmit() {
    let findIndex: number = this.items.findIndex(
      (item) => item.id == this.taskDetails?.id
    );
    this.taskService
      .updateProgress(this.taskDetails.id, this.newProgress)
      .subscribe({
        next: (updateTask: TaskResponse) => {
          this.items[findIndex] = updateTask;
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: error.error.message,
            life: 1000,
          });
        },
      });
    this.visibleSidebar = false;
  }

  onBackToProjects() {
    localStorage.removeItem('current-project-key');
    localStorage.removeItem('current-project-title');
    this.router.navigate(['user']);
  }
}
