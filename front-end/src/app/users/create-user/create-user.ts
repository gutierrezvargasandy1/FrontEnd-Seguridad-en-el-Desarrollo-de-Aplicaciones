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
    this.userData.name = this.userData.name?.trim();          // ← primero
    this.userData.lastname = this.userData.lastname?.trim();  // ← primero
    this.userData.username = this.userData.username?.trim();  // ← primero

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