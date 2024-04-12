import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent implements OnInit {
  items: MenuItem[] = [];

  ngOnInit(): void {
    this.items = [
      { label: 'Welcome', routerLink: '/welcome' },
      { label: 'Login', routerLink: '/welcome/login' },
      { label: 'Register', routerLink: '/welcome/register' },
    ];
  }
}
