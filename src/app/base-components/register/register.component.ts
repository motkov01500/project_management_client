import { Component } from '@angular/core';
import { UserRegister } from '../../models/user/user-register';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  newUser: UserRegister = {
    username: '',
    password: '',
    fullName: '',
  };

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.register(this.newUser).subscribe({
      error: (err) => {
        console.log(err.error.message);
      },
    });
  }
}
