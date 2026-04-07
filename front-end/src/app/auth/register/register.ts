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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router:Router,
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.message = '';

    const userData: CreateUserDto = this.registerForm.value;

    this.userService.createUser(userData).subscribe({
      next: (res) => {
        this.message = 'Usuario registrado correctamente';
        this.registerForm.reset();
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.message = 'Error al registrar usuario';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
