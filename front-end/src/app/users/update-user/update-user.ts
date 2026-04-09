import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService, User, UpdateUserDto, UserError } from '../../services/user';
import { AuthService, LoginError } from '../../services/auth';

@Component({
  selector: 'app-update-user',
  standalone: false,
  templateUrl: './update-user.html',
  styleUrls: ['./update-user.css']
})
export class UpdateUser implements OnInit {
  user: User | null = null;
  loading = false;
  successMessage = '';
  serverError = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.serverError = '';

    this.authService.me().subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (err: LoginError) => {
        this.serverError = err.userMessage;
        this.loading = false;
      }
    });
  }

  updateProfile(form: NgForm): void {
    this.serverError = '';
    this.fieldErrors = {};
    this.successMessage = '';

    if (form.invalid || !this.user) {
      form.control.markAllAsTouched();
      return;
    }

    this.loading = true;

    const updateDto: UpdateUserDto = {
      name: this.user.name,
      lastname: this.user.lastname,
      username: this.user.username
    };

    this.userService.updateProfile(updateDto).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.successMessage = 'Perfil actualizado correctamente';
        this.loading = false;
        form.control.markAsPristine();

        setTimeout(() => {
          this.router.navigate(['/dashboard/profile']);
        }, 1000);
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