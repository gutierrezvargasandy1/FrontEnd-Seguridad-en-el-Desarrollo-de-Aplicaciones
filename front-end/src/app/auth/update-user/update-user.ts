import { Component, OnInit } from '@angular/core';
import { AuthService, LoginError, User } from '../../services/auth';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-user',
  standalone: false,
  templateUrl: './update-user.html',
  styleUrl: './update-user.css',
})
export class UpdateUser implements OnInit {

  name = '';
  lastname = '';
  username = '';

  loading = false;
  successMessage = '';
  serverError = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.authService.me().subscribe({
      next: (user: User) => {
        this.name = user.name;
        this.lastname = user.lastname;
        this.username = user.username;
      },
      error: (err: LoginError) => {
        this.serverError = err.userMessage;
      }
    });
  }

  onUpdate(form: NgForm): void {
    this.name = this.name?.trim();          
    this.lastname = this.lastname?.trim();  
    this.username = this.username?.trim();  

    this.serverError = '';
    this.successMessage = '';
    this.fieldErrors = {};

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.loading = true;

    const data = {
      name: this.name,
      lastname: this.lastname,
      username: this.username
    };

    this.authService.updateProfile(data).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Perfil actualizado correctamente';
        this.router.navigate(['/dashboard/profile']);
      },
      error: (err: LoginError) => {
        this.loading = false;
        if ((err as any).fieldErrors) {
          this.fieldErrors = (err as any).fieldErrors;
        } else {
          this.serverError = err.userMessage;
        }
      }
    });
  }

  trimField(field: string): void {
    switch (field) {
      case 'name':
        this.name = this.name?.trim();
        break;
      case 'lastname':
        this.lastname = this.lastname?.trim();
        break;
      case 'username':
        this.username = this.username?.trim();
        break;
    }
  }
}