import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../../../../services/auth.service';
import { Router, RouterEvent } from '@angular/router';
import { UsersService } from '../../../../services/users.service';
import { UserResponse } from '../../../../models';
import { WebSocketService } from '../../../../services/web-socket.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  encapsulation: ViewEncapsulation.None,
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
      id: 'projects-nav-button',
      label: 'Projects',
      routerLink: 'projects',
    },
  ];

  //from 39 to 43 to be through all components.(when change navigation.url)
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      const navigationEvent = event as RouterEvent;
      const element = document.getElementById('projects-nav-button');
      if (navigationEvent.url && navigationEvent.url.endsWith('projects')) {
        element?.classList.remove('grayed');
      } else {
        element?.classList.add('grayed');
      }
    });
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
