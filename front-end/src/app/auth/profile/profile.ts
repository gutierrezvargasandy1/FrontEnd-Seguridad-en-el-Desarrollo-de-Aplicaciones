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
    this.loading = true;
    this.error = '';

    this.authService.me().subscribe({
      next: data => {

        // Validación extra por seguridad profesional
        if (!data || !data.username) {
          this.error = 'Datos del perfil incompletos.';
          this.loading = false;
          return;
        }

        this.user = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error obteniendo perfil', err);

        if (err.status === 0) {
          this.error = 'No hay conexión con el servidor.';
        }
        else if (err.status === 401) {
          this.error = 'Tu sesión ha expirado. Vuelve a iniciar sesión.';
        }
        else if (err.status === 404) {
          this.error = 'Perfil no encontrado.';
        }
        else {
          this.error = 'No se pudo cargar el perfil.';
        }

        this.loading = false;
      }
    });
  }
}