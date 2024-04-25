import { Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { UserRegister } from '../../models/user/user-register';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements DoCheck {
  newUser: UserRegister = {
    username: '',
    password: '',
    fullName: '',
  };
  passwordCheck: boolean = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService
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
      error: (err: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: err.error.message,
        });
      },
    });
  }
}
