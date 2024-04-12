import { Component, OnInit } from '@angular/core';
import { UserResponse, UserRole } from '../../../../models';
import { UsersService } from '../../../../services/users.service';
import { UserPasswordUpdate } from '../../../../models/user/user-update-password';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css',
})
export class MyProfileComponent implements OnInit {
  role: UserRole = {
    name: '',
  };
  currentLoggedUser: UserResponse = {
    id: 0,
    username: '',
    role: this.role,
    fullName: '',
  };
  hasImage: boolean = false;
  updatedUserPassword: UserPasswordUpdate = {
    password: '',
  };
  visibleSidebar: boolean = false;

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.userService.getCurrentLoggedUser().subscribe({
      next: (currentUser: UserResponse) => {
        this.currentLoggedUser = currentUser;
      },
    });
  }

  onChangePassword(userId: number) {
    this.visibleSidebar = true;
  }

  onSubmit() {
    this.userService
      .updateUserPassword(this.currentLoggedUser.id, this.updatedUserPassword)
      .subscribe({});
  }
}
