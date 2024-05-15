import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProjectResponse, UserResponse } from '../../../../models';
import { ProjectsService } from '../../../../services/projects.service';
import { UsersService } from '../../../../services/users.service';
import { Router } from '@angular/router';
import { TableLazyLoadEvent, TablePageEvent } from 'primeng/table';
import { SizeService } from '../../../../services/size.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent implements OnInit {
  projects: ProjectResponse[] = [];
  projectUsersSidebar: boolean = false;
  projectRelatedUsers: UserResponse[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  offset: number = 5;
  loading: boolean = false;

  constructor(
    private projectService: ProjectsService,
    private sizeService: SizeService,
    private userService: UsersService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.projectService
      .getProjectsRelatedToCurrentUser(this.currentPage, this.offset)
      .subscribe({
        next: (projects: ProjectResponse[]) => {
          this.projects = projects;
        },
      });
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

  onLazyLoad($event: TableLazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      this.projectService
        .getProjectsRelatedToCurrentUser(this.currentPage, this.offset)
        .subscribe({
          next: (projects: ProjectResponse[]) => {
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
  }
}
