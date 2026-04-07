import { Component } from '@angular/core';
import { UserService, User, UpdateUserDto } from '../../services/user';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-user',
  standalone: false,
  templateUrl: './update-user.html',
  styleUrl: './update-user.css',
})
export class UpdateUser {

  user: User | null = null;
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  // ✅ función sleep
  sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.me().subscribe({
      next: (res) => {
        this.user = res;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = this.extractError(err);
        this.loading = false;
      }
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

  updateProfile(form: NgForm): void {
    if (form.invalid || !this.user) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const updateDto: UpdateUserDto = {
      name: this.user.name,
      lastname: this.user.lastname,
      username: this.user.username,
    };

    this.userService.updateProfile(updateDto).subscribe({
      next: async (res) => {
        this.user = res;
        this.successMessage = 'Perfil actualizado correctamente';
        this.loading = false;
        form.control.markAsPristine();

        await this.sleep(1000); 
        this.router.navigate(['/dashboard/profile']);
      },
      error: (err) => {
        this.errorMessage = this.extractError(err);
        this.loading = false;
      }
    });
  }
}