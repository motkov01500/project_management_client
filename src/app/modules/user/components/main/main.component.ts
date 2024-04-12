import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  constructor(private authService: AuthService, private router: Router) {}

  menuItems: MenuItem[] = [
    { label: 'Projects', routerLink: 'projects' },
    { label: 'Meetings', routerLink: 'meetings' },
    { label: 'Task', routerLink: 'task' },
    { label: 'My Profile', routerLink: 'my-profile' },
    {
      label: 'Logout',
      command: () => {
        this.authService.logout();
        this.router.navigate(['/']);
      },
    },
  ];
}
