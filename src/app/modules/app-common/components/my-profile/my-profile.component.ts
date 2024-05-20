import { Component, OnInit } from '@angular/core';
import { UsersService } from 'app/services';
import base64 from 'base64-encode-file';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { UserPasswordUpdate, UserResponse, UserRole } from 'app/models';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css',
})
export class MyProfileComponent implements OnInit {
  onChoose(event: any, callback: any) {
    callback();
  }
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

    const element = document.getElementsByClassName('p-fileupload-choose');
    element.item(0)?.classList.add('test');
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
            severity: 'success',
            summary: 'Successfully changed password.',
            life: 1000,
          });
          this.visibleSidebar = false;
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

  onSelect(event: any): void {
    base64(event.currentFiles[0]).then((data) => {
      if (data) {
        this.userService
          .uploadImage(
            data,
            event.currentFiles[0].size,
            event.currentFiles[0].type
          )
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Photo upload completed.',
                detail: 'via admin',
              });
            },
          });
      }
    });
    if (event.currentFiles.length == 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Photo upload failed',
        detail: 'via admin',
      });
    }
  }

  onSucessfulUploadImage() {
    this.hasImage = true;
  }
  onOpenChangeImageSidebar() {
    this.imageSideBar = true;
  }
}
