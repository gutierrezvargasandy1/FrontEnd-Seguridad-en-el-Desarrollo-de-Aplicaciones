import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService, LoginError } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  username = '';
  password = '';
  loading = false;
  serverError = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(form: NgForm): void {
    this.serverError = '';
    this.fieldErrors = {};

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard/tasks']);
      },
      error: (err: LoginError) => {
        this.loading = false;
        if (err.fieldErrors) {
          this.fieldErrors = err.fieldErrors;
        } else {
          this.serverError = err.userMessage;
        }
      }
    });
  }
}