import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../../../services/projects.service';
import { ProjectResponse } from '../../../../../models';

@Component({
  selector: 'app-projects-without-users',
  templateUrl: './projects-without-users.component.html',
  styleUrl: './projects-without-users.component.css',
})
export class ProjectsWithoutUsersComponent implements OnInit {
  projectsWithoutUsers: ProjectResponse[] = [];

  constructor(private projectService: ProjectsService) {}

  ngOnInit(): void {
    this.projectService.getProjectsWithoutAssignUsers().subscribe({
      next: (projects: ProjectResponse[]) => {
        this.projectsWithoutUsers = projects;
      },
    });
  }
}
