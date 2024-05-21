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
    this.service.loginIn(this.username, this.password);
  }

  redirectToRegister() {
    this.router.navigate(['register']);
  }
}
