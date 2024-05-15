import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserResponse } from '../../../../models';
import { UsersService } from '../../../../services/users.service';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProjectsService } from '../../../../services/projects.service';
import { TasksService } from '../../../../services/tasks.service';
import { TaskResponse } from '../../../../models/task/task-response';
import { TableLazyLoadEvent, TablePageEvent } from 'primeng/table';
import { SizeService } from '../../../../services/size.service';

@Component({
  selector: 'app-user-task-related',
  templateUrl: './user-task-related.component.html',
  styleUrl: './user-task-related.component.css',
})
export class UserTaskRelatedComponent implements OnInit {
  totalRecords: number = 0;
  loading: boolean = false;
  page: number = 1;
  offset: number = 5;
  items: UserResponse[] = [];
  projectKey: string | null = localStorage.getItem('current-project-key');
  userRole: string | null = this.authService.getRole();
  taskId: any = localStorage.getItem('current-task-id');
  currentTask: TaskResponse | undefined;

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
    this.userService
      .getRelatedToTask(this.taskId, this.page, this.offset)
      .subscribe({
        next: (users: UserResponse[]) => {
          this.items = users;
        },
      });
    this.taskService.getById(this.taskId).subscribe({
      next: (currentTask: TaskResponse) => {
        this.currentTask = currentTask;
      },
    });
    this.sizeService.getUsersRelatedToTaskSize(this.taskId).subscribe({
      next: (totalRecords: number) => {
        this.totalRecords = totalRecords;
      },
    });
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
  }

  onChangePage(event: TablePageEvent) {
    this.page = event.first / event.rows + 1;
  }

  onLazyLoad($event: TableLazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      this.userService
        .getRelatedToTask(this.taskId, this.page, this.offset)
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
  }
}
