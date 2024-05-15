import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserResponse } from '../../../../models';
import { UsersService } from '../../../../services/users.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { ProjectsService } from '../../../../services/projects.service';
import { MessageService } from 'primeng/api';
import { TableLazyLoadEvent, TablePageEvent } from 'primeng/table';
import { SizeService } from '../../../../services/size.service';

@Component({
  selector: 'app-user-project-related',
  templateUrl: './user-project-related.component.html',
  styleUrl: './user-project-related.component.css',
})
export class UserProjectRelatedComponent implements OnInit {
  items: UserResponse[] = [];
  projectKey: string | null = localStorage.getItem('current-project-key');
  projectTitle: string | null = localStorage.getItem('current-project-title');
  userRole: string | null = this.authService.getRole();
  loading: boolean | undefined;
  totalRecords: number = 0;
  page: number = 1;
  offset: number = 5; //default

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
  }

  onChangePage(event: TablePageEvent) {
    this.page = event.first / event.rows + 1;
  }

  onLazyLoad($event: TableLazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      this.userService
        .getRelatedToProject(this.projectKey, this.page, 1)
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
  }
}
