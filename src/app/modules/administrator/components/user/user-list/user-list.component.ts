import {
  Component,
  DoCheck,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  UserDetails,
  UserEdit,
  UserResponse,
  UserRole,
} from '../../../../../models';
import { UsersService } from '../../../../../services/users.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { WebSocketService } from '../../../../../services/web-socket.service';

@Component({
  selector: 'app-users',
  templateUrl: './user-list.component.html',
  styleUrl: './users.component.css',
})
export class UserListComponent implements OnInit {
  items: UserResponse[] = [];
  visibleSidebar: boolean = false;
  userDetails: UserResponse | any;
  roles: string[] = ['user', 'administrator'];
  selectedRole: string = '';
  username: string = '';
  password: string = '';
  fullName: string = '';

  constructor(
    private service: UsersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.service.getAllUsers().subscribe({
      next: (data: any) => {
        this.items = data;
      },
    });
  }

  onDelete(event: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      accept: () => {
        this.service.deleteUser(event).subscribe({});
        this.items = this.items.filter((item) => item.id != event);
        this.messageService.add({
          severity: 'success',
          summary: 'User deleted',
          detail: 'via admin',
        });
        this.webSocketService.sendMessage(`The user is deleted`);
      },
      reject: () => {
        this.confirmationService.close();
      },
      key: 'positionDialog',
    });
  }

  onEdit(userId: number) {
    this.visibleSidebar = true;
    this.service.getById(userId).subscribe({
      next: (user: UserResponse) => {
        this.userDetails = user;
      },
    });
  }

  onSubmit() {
    let updatedUser: UserEdit = {
      username: this.username,
      password: this.password,
      fullName: this.fullName,
      role: this.selectedRole,
    };
    let itemIndex: number = this.items.findIndex(
      (item) => item.username == this.userDetails.username
    );
    this.service.editUser(updatedUser, this.userDetails.id).subscribe({
      next: (user: UserResponse) => {
        this.items[itemIndex] = user;
        this.messageService.add({
          severity: 'success',
          summary: 'User Edited',
          detail: 'via admin',
        });
      },
    });
    this.webSocketService.sendMessage(`User is Edited`);
    this.visibleSidebar = false;
  }
}
