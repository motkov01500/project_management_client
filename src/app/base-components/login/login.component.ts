import { Component } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { jwtDecode } from 'jwt-decode';
import { AuthService, WebSocketService } from 'app/services';
import { AuthResponse, TokenClaims } from 'app/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private service: AuthService,
    private router: Router,
    private messageService: MessageService,
    private webSocketService: WebSocketService
  ) {}

  login(): void {
    this.service.login(this.username, this.password).subscribe({
      next: (response: AuthResponse) => {
        let decoded = jwtDecode(response.token) as TokenClaims;
        let role: string = decoded.auth;
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', decoded.auth);
        // this.webSocketService.connect().subscribe({});
        if (role === 'user') {
          this.router.navigate(['user', 'projects']);
        }
        if (role === 'administrator') {
          this.router.navigate(['administrator', 'user', 'get-all']);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error.message,
        });
      },
    });
  }

  redirectToRegister() {
    this.router.navigate(['register']);
  }
}
