import { Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserRegister } from 'app/models';
import { AuthService } from 'app/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements DoCheck {
  newUser: UserRegister = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
  };
  passwordCheck: boolean = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngDoCheck(): void {
    if (!/(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(this.newUser.password)) {
      this.passwordCheck = false;
    } else {
      this.passwordCheck = true;
    }
  }

  onSubmit() {
    this.authService.register(this.newUser).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'You registered successfully.',
        });
        this.authService.loginIn(this.newUser.username, this.newUser.password);
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: err.error.message,
        });
      },
    });
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }
}
