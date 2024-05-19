import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponse } from 'app/models';
import { AuthService, UsersService, WebSocketService } from 'app/services';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  currentLoggedUsername: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UsersService,
    private websocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    // this.websocketService.connect();
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

  ngOnDestroy(): void {
    localStorage.clear();
  }
}
