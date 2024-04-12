import { Component, OnInit } from '@angular/core';
import { ProjectResponse, UserResponse } from '../../../../models';
import { ProjectsService } from '../../../../services/projects.service';
import { UsersService } from '../../../../services/users.service';

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
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.projectService.getProjectsRelatedToCurrentUser().subscribe({
      next: (projects: ProjectResponse[]) => {
        this.projects = projects;
      },
    });
  }

  onViewUsers(projectKey: string) {
    this.projectUsersSidebar = true;
    this.userService.getRelatedToProject(projectKey).subscribe({
      next: (users: UserResponse[]) => {
        this.projectRelatedUsers = users;
      },
    });
  }
}
