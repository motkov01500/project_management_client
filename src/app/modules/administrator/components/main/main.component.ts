import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../../services/auth.service';
import { UsersService } from '../../../../services/users.service';
import { UserResponse } from '../../../../models';
import { WebSocketService } from '../../../../services/web-socket.service';

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
    private userService: UsersService,
    private websocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.websocketService.connect();
    this.items = [
      {
        label: 'Users',
        items: [
          { label: 'User List', routerLink: 'user/get-all' },
          { label: 'Assign to Project', routerLink: 'user/assign-user' },
        ],
      },
      {
        label: 'Projects',
        items: [
          { label: 'Project List', routerLink: 'project/get-all' },
          {
            label: 'No Assignees',
            routerLink: 'project/project-without-assignees',
          },
        ],
      },
    ];
    this.userService.getCurrentLoggedUser().subscribe({
      next: (user: UserResponse) => {
        this.currentLoggedUsername = user.username;
      },
    });
  }
}
