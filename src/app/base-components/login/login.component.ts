import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpResponse } from '@angular/common/http';
import { UserResponse } from '../../models/user/user-response';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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
    private messageService: MessageService
  ) {}

  login(): void {
    this.service.login(this.username, this.password).subscribe({
      next: (response: HttpResponse<UserResponse>) => {
        const token = response.headers.get('Authorization')?.split(' ')[1];
        const role = response.body?.role.name;
        localStorage.setItem('token', token ? token : '');
        localStorage.setItem('role', role ? role : '');
        if (role === 'user') {
          this.router.navigate(['user']);
        }
        if (role === 'administrator') {
          this.router.navigate(['administrator']);
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Wrong Credentials',
        });
      },
    });
  }
}
