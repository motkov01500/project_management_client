import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Router, RouterEvent } from '@angular/router';
import { AuthService, UsersService, WebSocketService } from 'app/services';
import { UserResponse } from 'app/models';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit, OnDestroy {
  username: string = '';
  messages: string[] = [];
  currentUser?: UserResponse;

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
      if (navigationEvent.url) {
        if (navigationEvent.url.endsWith('projects')) {
          element?.classList.add('grayed');
        } else {
          element?.classList.remove('grayed');
        }
      } else {
        if (location.href.endsWith('projects')) {
          element?.classList.add('grayed');
        }
      }
      if (this.currentUser?.isDeleted) {
        localStorage.clear();
        this.router.navigate(['login']);
      }
    });
    this.userService.getCurrentLoggedUser().subscribe({
      next: (currentLoggedUser: UserResponse) => {
        this.username = currentLoggedUser.username;
        this.currentUser = currentLoggedUser;
      },
      error: () => {
        localStorage.clear();
        this.router.navigate(['login']);
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

  ngOnDestroy(): void {
    localStorage.clear();
  }
}
