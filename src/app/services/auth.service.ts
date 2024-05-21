import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRegister } from '../models/user/user-register';
import { UserResponse } from '../models/user/user-response';
import { apiUrl } from '../shared/constants';
import { AuthResponse } from '../models/AuthResponse';
import { jwtDecode } from 'jwt-decode';
import { TokenClaims } from 'app/models';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) {}

  login(username: string, password: string): Observable<AuthResponse> {
    let url = `${apiUrl}v1/auth/login`;
    return this.http.post<AuthResponse>(url, {
      username: username,
      password: password,
    });
  }

  loginIn(username: string, password: string): void {
    this.login(username, password).subscribe({
      next: (response: AuthResponse) => {
        let decoded = jwtDecode(response.token) as TokenClaims;
        let role: string = decoded.auth;
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', decoded.auth);
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

  register(newUser: UserRegister): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${apiUrl}v1/auth/register`, {
      username: newUser.username,
      password: newUser.password,
      confirmPassword: newUser.confirmPassword,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    });
  }

  isLogged(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.clear();
  }
}
