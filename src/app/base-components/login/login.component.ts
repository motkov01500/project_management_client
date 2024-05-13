import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { UserResponse } from '../../models/user/user-response';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { WebSocketService } from '../../services/web-socket.service';

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
      next: (response: HttpResponse<UserResponse>) => {
        const token = response.headers.get('Authorization')?.split(' ')[1];
        const role = response.body?.role.name;
        localStorage.setItem('token', token ? token : '');
        localStorage.setItem('role', role ? role : '');
        // this.webSocketService.connect().subscribe({});
        if (role === 'user') {
          this.router.navigate(['user']);
        }
        if (role === 'administrator') {
          this.router.navigate(['administrator']);
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
}
