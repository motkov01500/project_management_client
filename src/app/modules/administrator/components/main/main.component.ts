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
        routerLink: 'user/get-all',
      },
      {
        label: 'Projects',
        routerLink: 'project/get-all',
      },
    ];
    this.userService.getCurrentLoggedUser().subscribe({
      next: (user: UserResponse) => {
        this.currentLoggedUsername = user.username;
      },
    });
  }
}
