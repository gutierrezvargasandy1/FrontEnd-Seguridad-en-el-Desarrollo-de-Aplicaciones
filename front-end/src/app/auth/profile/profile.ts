import { Component } from '@angular/core';
import { AuthService, User } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  user: User | null = null;
  loading: boolean = true;
  error: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.me().subscribe({
      next: data => {
        this.user = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error obteniendo perfil', err);
        this.error = 'No se pudo cargar el perfil';
        this.loading = false;
      }
    });
  }
}
