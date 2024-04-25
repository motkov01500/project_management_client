import { Component, OnInit } from '@angular/core';
import { UserResponse, UserRole } from '../../../../models';
import { UsersService } from '../../../../services/users.service';
import { UserPasswordUpdate } from '../../../../models/user/user-update-password';
import base64 from 'base64-encode-file';
import {
  FileBeforeUploadEvent,
  FileUploadEvent,
  FileUploadHandlerEvent,
} from 'primeng/fileupload';

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
    imageUrl: '',
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
        if (!!currentUser.imageUrl) {
          this.hasImage = true;
        }
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

  onSelect(event: FileUploadHandlerEvent): void {
    // const file = event.target.files[0];
    // base64(file).then((data) => {
    //   if (data) {
    //     this.userService.uploadImage(data).subscribe({});
    //   }
    //   this.hasImage = true;
    // });
    base64(event.files[0]).then((data) => {
      if (data) {
        this.userService.uploadImage(data).subscribe({});
      }
    });
  }

  onSucessfulUploadImage() {
    this.hasImage = true;
  }
}
