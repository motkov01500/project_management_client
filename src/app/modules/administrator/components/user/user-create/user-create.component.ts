import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UserRequest } from '../../../../../models/user/user-request';
import { UsersService } from '../../../../../services/users.service';
import { WebSocketService } from '../../../../../services/web-socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css',
})
export class UserCreateComponent {
  userCredentials: UserRequest = {
    username: '',
    password: '',
    fullName: '',
  };

  constructor(
    private service: UsersService,
    private router: Router,
    private messageService: MessageService,
    private webSocketService: WebSocketService
  ) {}

  onSubmit() {
    this.service.createUser(this.userCredentials).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'User created',
          detail: 'via admin',
        });
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error.message,
          detail: 'via admin',
        });
      },
    });
    this.webSocketService.sendMessage(`New user is created`);
  }

  onHomeButton() {
    this.router.navigate(['administrator']);
  }
}
