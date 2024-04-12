import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../shared/constants';
import { Observable } from 'rxjs';
import { UserResponse } from '../models/user/user-response';
import { jwtDecode } from 'jwt-decode';
import { UserRegister } from '../models/user/user-register';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(
    username: string,
    password: string
  ): Observable<HttpResponse<UserResponse>> {
    let url = `${apiUrl}v1/auth/login?username=${username}&password=${password}`;
    return this.http.post<UserResponse>(url, {}, { observe: 'response' });
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
