import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { UsersService } from '../../../../services/users.service';
import { UserResponse } from '../../../../models';
import { WebSocketService } from '../../../../services/web-socket.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  username: string = '';
  messages: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UsersService,
    private webSocketService: WebSocketService,
    private messageService: MessageService
  ) {}

  menuItems: MenuItem[] = [
    {
      label: 'Projects',
      routerLink: 'projects',
    },
  ];

  ngOnInit(): void {
    this.userService.getCurrentLoggedUser().subscribe({
      next: (currentLoggedUser: UserResponse) => {
        this.username = currentLoggedUser.username;
      },
    });
    this.webSocketService.connect().subscribe({
      next: (message) => {
        this.messageService.add({
          severity: 'info',
          summary: message.data,
          detail: 'via admin',
          life: 2000,
        });
      },
    });
  }
}
