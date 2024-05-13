import { Component, OnInit } from '@angular/core';
import { ProjectResponse, UserResponse } from '../../../../models';
import { ProjectsService } from '../../../../services/projects.service';
import { UsersService } from '../../../../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent implements OnInit {
  projects: ProjectResponse[] = [];
  projectUsersSidebar: boolean = false;
  projectRelatedUsers: UserResponse[] = [];

  constructor(
    private projectService: ProjectsService,
    private userService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectService.getProjectsRelatedToCurrentUser().subscribe({
      next: (projects: ProjectResponse[]) => {
        this.projects = projects;
      },
    });
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
}
