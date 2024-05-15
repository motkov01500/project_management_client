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
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css',
})
export class MyProfileComponent implements OnInit {
  imageSideBar: boolean = false;

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
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };
  visibleSidebar: boolean = false;

  constructor(
    private userService: UsersService,
    private messageService: MessageService
  ) {}

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
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Successfully changed password.',
            life: 1000,
          });
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: error.error.message,
            life: 1000,
          });
        },
      });
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
        this.userService
          .uploadImage(data, event.files[0].size, event.files[0].type)
          .subscribe({});
      }
    });
  }

  onSucessfulUploadImage() {
    this.hasImage = true;
  }
  onOpenChangeImageSidebar() {
    this.imageSideBar = true;
  }
}
