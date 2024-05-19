import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, of, Subject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  let router = inject(Router);
  const token: string | null = authService.getToken();

  if (token) {
    const decodedToken = jwtDecode(token);
    const isExpired: boolean =
      decodedToken.exp && token ? decodedToken.exp < Date.now() / 1000 : false;

    if (!isExpired) {
      const authRequest = req.clone({
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      });
      return next(authRequest);
    }
    localStorage.clear();
    router.navigate(['login']);
  }
  return next(req);
};
