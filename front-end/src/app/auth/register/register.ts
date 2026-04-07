import { Component } from '@angular/core';
import { UserService, CreateUserDto } from '../../services/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  loading = false;

  message = '';
  successMessage = '';
  serverError = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  private extractError(err: any): string {
    try {
      const body = typeof err.error === 'string' ? JSON.parse(err.error) : err.error;
      const msg = body?.message;
      if (Array.isArray(msg)) return msg[0];
      if (typeof msg === 'string') return msg;
      if (typeof body === 'string') return body;
      return String(err.status || 'Error');
    } catch {
      return String(err.status || 'Error');
    }
  }

  submit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.message = '';
    this.successMessage = '';
    this.serverError = '';

    const userData: CreateUserDto = this.registerForm.value;

    this.userService.createUser(userData).subscribe({
      next: () => {
        this.successMessage = 'Usuario registrado correctamente';
        this.loading = false;
        this.registerForm.reset();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: (err) => {
        this.serverError = this.extractError(err);
        this.loading = false;
      }
    });
  }
}