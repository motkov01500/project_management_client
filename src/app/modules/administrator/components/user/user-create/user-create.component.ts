import { Component } from '@angular/core';
import { UserRequest } from '../../../../../models/user/user-request';
import { HttpClient } from '@angular/common/http';
import { UsersService } from '../../../../../services/users.service';
import { UserResponse } from '../../../../../models';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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
    private messageService: MessageService
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
    });
  }
}
