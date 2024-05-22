import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectDetails, ProjectResponse, UserResponse } from 'app/models';
import {
  ProjectsService,
  SizeService,
  UsersService,
  UserProjectDetailsService,
} from 'app/services';
import { SortEvent } from 'primeng/api';
import { TablePageEvent } from 'primeng/table';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent implements OnInit {
  projects: ProjectDetails[] = [];
  projectUsersSidebar: boolean = false;
  projectRelatedUsers: UserResponse[] = [];
  totalRecords: number = 1;
  currentPage: number = 1;
  offset: number = 5;
  loading: boolean = false;
  sortColumn?: string = '';
  sortOrder?: string = '';

  constructor(
    private projectService: ProjectsService,
    private sizeService: SizeService,
    private userService: UsersService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private userProjectDetailsService: UserProjectDetailsService
  ) {}

  ngOnInit(): void {
    this.sizeService.getProjectsRelatedToCurrentUserSize().subscribe({
      next: (totalRecords: number) => {
        this.totalRecords = totalRecords;
      },
    });
    this.cdr.detectChanges();
  }

  onViewUsers(projectKey: string, projectTitle: string) {
    this.router.navigate(['user', 'projects', 'users']);
    localStorage.setItem('current-project-key', projectKey);
    localStorage.setItem('current-project-title', projectTitle);
  }

  addCurrentProjectToLocalStorage(projectKey: string, projectTitle: string) {
    localStorage.setItem('current-project-key', projectKey);
    localStorage.setItem('current-project-title', projectTitle);
  }
  onHomeButton() {
    this.router.navigate(['user']);
  }

  onChangePage(event: TablePageEvent) {
    this.currentPage = event.first / event.rows + 1;
  }

  onLazyLoad() {
    this.loading = true;
    setTimeout(() => {
      this.userProjectDetailsService
        .getAll(this.currentPage, this.offset, this.sortColumn, this.sortOrder)
        .subscribe({
          next: (projects: ProjectDetails[]) => {
            this.projects = projects;
          },
        });
      this.sizeService.getProjectsRelatedToCurrentUserSize().subscribe({
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
