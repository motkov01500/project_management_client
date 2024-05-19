import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRegister } from '../models/user/user-register';
import { UserResponse } from '../models/user/user-response';
import { apiUrl } from '../shared/constants';
import { AuthResponse } from '../models/AuthResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    let url = `${apiUrl}v1/auth/login`;
    return this.http.post<AuthResponse>(url, {
      username: username,
      password: password,
    });
  }

  register(newUser: UserRegister): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${apiUrl}v1/auth/register`, {
      username: newUser.username,
      password: newUser.password,
      fullName: newUser.fullName,
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
