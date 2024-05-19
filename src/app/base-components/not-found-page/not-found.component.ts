import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/services';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  constructor(private router: Router, private authService: AuthService) {}

  onNavigateToHome() {
    let currentRole: string | null = this.authService.getRole();
    if (currentRole) {
      currentRole === 'user'
        ? this.router.navigate(['user', 'projects'])
        : this.router.navigate(['administrator', 'user', 'get-all']);
    }
    this.router.navigate(['login']);
  }
}
