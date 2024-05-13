import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { UserResponse } from '../../../../models';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { UsersService } from '../../../../services/users.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  items: MenuItem[] = [];
  icon: string = 'pi pi-check';
  userRole: string | null = this.authService.getRole();
  userDetails: UserResponse | undefined;

  constructor(
    private authService: AuthService,
    private routerService: Router,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentLoggedUser().subscribe({
      next: (user: UserResponse) => {
        this.userDetails = user;
      },
    });
  }

  @Output() myProfileEventEmitter = new EventEmitter<void>();

  @Input() username: string = '';

  get itemsArray(): MenuItem[] {
    return this.items;
  }

  @Input()
  set itemsArray(value: MenuItem[]) {
    this.items = value;
  }

  logout() {
    this.authService.logout();
    this.routerService.navigate(['welcome']);
  }
}
