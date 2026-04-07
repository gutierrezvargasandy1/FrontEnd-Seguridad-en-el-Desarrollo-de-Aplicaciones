import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router : Router) {}

  onLogin() {
    this.authService.login(this.username, this.password)
      .subscribe({
        next: (res) => {
          this.router.navigate(['/dashboard/tasks']);

        },
        error: (err) => {
          console.error('Error login', err);
        }
      });
  }

}
