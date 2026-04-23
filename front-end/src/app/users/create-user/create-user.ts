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

  confirmPassword: string = '';

  loading = false;
  serverError = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  createUser(form: NgForm): void {

    // Trim primero
    this.userData.name = this.userData.name?.trim();
    this.userData.lastname = this.userData.lastname?.trim();
    this.userData.username = this.userData.username?.trim();

    this.serverError = '';
    this.fieldErrors = {};

    // ❗ Validación extra antes del form.invalid
    if (this.userData.password !== this.confirmPassword) {
      form.control.markAllAsTouched();
      return;
    }

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.userService.createUser(this.userData).subscribe({
      next: () => {
        this.loading = false;
        form.resetForm();
        this.confirmPassword = '';
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

  trimField(field: string): void {
    switch (field) {
      case 'name':
        this.userData.name = this.userData.name?.trim();
        break;
      case 'lastname':
        this.userData.lastname = this.userData.lastname?.trim();
        break;
      case 'username':
        this.userData.username = this.userData.username?.trim();
        break;
    }
  }
}