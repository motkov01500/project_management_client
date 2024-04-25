import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../../services/auth.service';
import { UsersService } from '../../../../services/users.service';
import { UserResponse } from '../../../../models';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  items: MenuItem[] = [];
  currentLoggedUsername: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Users',
        items: [
          { label: 'User List', routerLink: 'user/get-all' },
          { label: 'Create User', routerLink: 'user/create' },
          { label: 'Assign to Project', routerLink: 'user/assign-user' },
        ],
      },
      {
        label: 'Projects',
        items: [
          { label: 'Project List', routerLink: 'project/get-all' },
          { label: 'Create Project', routerLink: 'project/create' },
          {
            label: 'No Assignees',
            routerLink: 'project/project-without-assignees',
          },
        ],
      },
      {
        label: 'Tasks',
        items: [
          { label: 'Task List', routerLink: 'task/get-all' },
          { label: 'Create Task', routerLink: 'task/create' },
        ],
      },
      {
        label: 'Meetings',
        items: [
          { label: 'Meeting List', routerLink: 'meeting/get-all' },
          { label: 'Create Meeting', routerLink: 'meeting/create' },
        ],
      },
      {
        label: 'Logout',
        command: () => {
          this.authService.logout();
          this.router.navigate(['/']);
        },
        style: { color: 'red' },
      },
    ];
    this.userService.getCurrentLoggedUser().subscribe({
      next: (user: UserResponse) => {
        this.currentLoggedUsername = user.username;
      },
    });
  }
}
