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

  createUser(form: NgForm) {
    if (form.invalid) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }

    this.loading = true;
    this.error = null;

    this.userService.createUser(this.userData).subscribe({
      next: (res) => {
        console.log('Usuario creado:', res);

        this.loading = false;
        form.resetForm();

        // Redirige a la lista de usuarios
        this.router.navigate(['/dashboard/users']);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al crear el usuario';
        this.loading = false;
      }
    });
  }
}
