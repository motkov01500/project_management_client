import { Component, OnInit } from '@angular/core';
import { UserResponse } from '../../../../../models';
import { UsersService } from '../../../../../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-project-related',
  templateUrl: './user-project-related.component.html',
  styleUrl: './user-project-related.component.css',
})
export class UserProjectRelatedComponent implements OnInit {
  items: UserResponse[] = [];
  projectKey: string | null = localStorage.getItem('current-project-key');

  constructor(private userService: UsersService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getRelatedToProject(this.projectKey).subscribe({
      next: (users: UserResponse[]) => {
        this.items = users;
      },
    });
  }

  onHomeButton() {
    throw new Error('Method not implemented.');
  }
}
