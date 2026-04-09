import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService, RegisterError } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  name = '';
  lastname = '';
  username = '';
  password = '';
  confirmPassword = '';

  loading = false;
  successMessage = '';
  serverError = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister(form: NgForm): void {
    this.serverError = '';
    this.fieldErrors = {};

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.password !== this.confirmPassword) {
      form.form.controls['confirmPassword']?.setErrors({ notMatch: true });
      form.control.markAllAsTouched();
      return;
    }

    this.loading = true;

    const userData = {
      name: this.name,
      lastname: this.lastname,
      username: this.username,
      password: this.password
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.successMessage = 'Usuario registrado correctamente';
        this.loading = false;
        form.resetForm();
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err: RegisterError) => {
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