import { Component } from '@angular/core';
import { UserService, User, UpdateUserDto } from '../../services/user';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-update-user',
  standalone: false,
  templateUrl: './update-user.html',
  styleUrl: './update-user.css',
})
export class UpdateUser {
 user: User | null = null;
  password: string = '';
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.authService.me().subscribe({
      next: (res) => this.user = res,
      error: (err) => {
        console.error('Error loading profile', err);
        this.errorMessage = 'No se pudo cargar el perfil';
      }
    });
  }

  updateProfile(form: NgForm) {
    if (!this.user) return;

    const updateDto: UpdateUserDto = {
      name: this.user.name,
      lastname: this.user.lastname,
      username: this.user.username,
    };

    this.loading = true;
    this.userService.updateProfile(updateDto).subscribe({
      next: (res) => {
        this.successMessage = 'Perfil actualizado correctamente';
        this.errorMessage = '';
        this.password = ''; 
        this.user = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error updating profile', err);
        this.errorMessage = 'Error al actualizar el perfil';
        this.successMessage = '';
        this.loading = false;
      }
    });
  }
}