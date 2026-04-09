import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, CreateUserDto, UserError } from '../../services/user';

@Component({
  selector: 'app-create-user',
  standalone: false,
  templateUrl: './create-user.html',
  styleUrls: ['./create-user.css']
})
export class CreateUser {
  userData: CreateUserDto = {
    name: '',
    lastname: '',
    username: '',
    password: ''
  };

  loading = false;
  serverError = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  createUser(form: NgForm): void {
    // Limpiar errores previos
    this.serverError = '';
    this.fieldErrors = {};

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.userService.createUser(this.userData).subscribe({
      next: () => {
        this.loading = false;
        form.resetForm();
        this.router.navigate(['/dashboard/users']);
      },
      error: (err: UserError) => {
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