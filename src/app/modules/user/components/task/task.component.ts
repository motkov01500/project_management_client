import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { TableLazyLoadEvent, TablePageEvent } from 'primeng/table';
import { SizeService, TasksService } from 'app/services';
import { TaskProgress, TaskResponse } from 'app/models';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements OnInit {
  totalRecords: number = 1;
  loading: boolean = false;
  page: number = 1;
  offset: number = 5;
  items: TaskResponse[] = [];
  newProgress: TaskProgress = {
    progress: 0,
    hoursSpent: 0,
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
    private sizeService: SizeService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskService
      .getCurrentUserRelatedTasks(this.projectKey, this.page, this.offset)
      .subscribe({
        next: (tasks: TaskResponse[]) => {
          this.items = tasks;
        },
      });
    this.sizeService
      .getTasksCurrentUserRelatedTasksSize(this.projectKey)
      .subscribe({
        next: (totalRecords: number) => {
          this.totalRecords = totalRecords;
        },
      });
    this.colorTaskStatusName = 'red';
    this.cdr.detectChanges();
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
    console.log(typeof this.newProgress.hoursSpent);
    this.taskService
      .updateProgress(this.taskDetails.id, this.newProgress)
      .subscribe({
        next: (updateTask: TaskResponse) => {
          this.items[findIndex] = updateTask;
          this.messageService.add({
            severity: 'success',
            summary: 'Successfully updated task.',
            life: 1000,
          });
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

  onChangePage(event: TablePageEvent) {
    this.page = event.first / event.rows + 1;
  }

  onLazyLoad($event: TableLazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      this.taskService
        .getCurrentUserRelatedTasks(this.projectKey, this.page, this.offset)
        .subscribe({
          next: (tasks: TaskResponse[]) => {
            this.items = tasks;
          },
        });
      this.sizeService
        .getTasksCurrentUserRelatedTasksSize(this.projectKey)
        .subscribe({
          next: (totalRecords: number) => {
            this.totalRecords = totalRecords;
          },
        });
      this.loading = false;
    }, 600);
    this.cdr.detectChanges();
  }

  OnDefaultValue(event: any) {
    if (event.target.value.toString().length == 0) {
      event.target.value = Number(0);
      this.newProgress.hoursSpent = 0;
      this.newProgress.progress = 0;
    }
  }
  onViewUsers(taskId: string) {
    localStorage.setItem('current-task-id', taskId.toString());
    this.router.navigate(['user', 'projects', 'tasks', 'users']);
  }
}
