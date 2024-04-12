import { Component, OnInit } from '@angular/core';
import { ProjectResponse, UserResponse, UserRole } from '../../../../../models';
import { UsersService } from '../../../../../services/users.service';
import { ProjectsService } from '../../../../../services/projects.service';
import { ProjectUserAssign } from '../../../../../models/project/project-user-assign';

@Component({
  selector: 'app-assign-user-to-project',
  templateUrl: './assign-user-to-project.component.html',
  styleUrl: './assign-user-to-project.component.css',
})
export class AssignUserToProjectComponent implements OnInit {
  assignUserToProject: ProjectUserAssign = { projectId: 0, userId: 0 };
  selectedProject: ProjectResponse = { key: '', title: '', id: 0 };
  projects: ProjectResponse[] = [];
  items: UserResponse[] = [];
  visibleSidebar: boolean = false;
  role: UserRole = { name: '' };
  userDetails: UserResponse = {
    id: 0,
    username: '',
    fullName: '',
    role: this.role,
  };

  constructor(
    private userService: UsersService,
    private projectService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.userService.getUnassignedToProjectUsers().subscribe({
      next: (users: UserResponse[]) => {
        this.items = users;
      },
    });
  }

  onAssign(userId: number) {
    this.visibleSidebar = true;
    this.projectService.getAllProjects().subscribe({
      next: (projects: ProjectResponse[]) => {
        this.projects = projects;
      },
    });
    this.assignUserToProject.userId = this.items.filter(
      (user) => (user.id = userId)
    )[0].id;
  }

  onSubmit() {
    this.assignUserToProject.projectId = this.selectedProject.id;
    this.projectService
      .assignUserToProject(this.assignUserToProject)
      .subscribe({
        next: (message: string) => {
          console.log(message);
        },
      });
    this.items = this.items.filter((item) => item.id != this.userDetails.id);
  }
}
