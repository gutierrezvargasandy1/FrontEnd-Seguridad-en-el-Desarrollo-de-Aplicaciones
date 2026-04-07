import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService, CreateUserDto } from '../../services/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  standalone: false,
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUser {

  userData: CreateUserDto = {
    name: '',
    lastname: '',
    username: '',
    password: ''
  };

  loading: boolean = false;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

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

  createUser(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      this.error = 'Corrige los campos marcados';
      return;
    }

    this.loading = true;
    this.error = null;

    this.userService.createUser(this.userData).subscribe({
      next: () => {
        this.loading = false;
        form.resetForm();
        this.router.navigate(['/dashboard/users']);
      },
      error: (err) => {
        this.error = this.extractError(err);
        this.loading = false;
      }
    });
  }
}