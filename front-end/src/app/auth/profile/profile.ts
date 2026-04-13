import { Component, OnInit } from '@angular/core';
import { AuthService, User, LoginError } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  user: User | null = null;
  loading = true;
  serverError = '';
  fieldErrors: { [key: string]: string } = {}; // Por consistencia, aunque no se use aquí

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  deleteUser(): void {
    if (confirm('Estas Seguro de eliminar tu perfil Esta accion no se puede Desechar'))
    {
      this.loading=true;
      this.serverError='';

      this.authService.logout().subscribe(
        {
          next: () => {
            this.user = null;
            this.loading = false;
            alert('Perfil eliminado Exitosamente')
            this.router.navigate(['/login']);
          },

          error: (error: LoginError) => {
            this.serverError = error.userMessage || 'Error al eliminar el perfil.';
            this.loading = false;}
        }
      )

    }

  }

  loadProfile(): void {
    this.loading = true;
    this.serverError = '';

    this.authService.me().subscribe({
      next: (user) => {
        if (!user || !user.username) {
          this.serverError = 'Datos del perfil incompletos.';
          this.loading = false;
          return;
        }
        this.user = user;
        this.loading = false;
      },
      error: (err: LoginError) => {
        this.serverError = err.userMessage;
        this.loading = false;
      }
    });
  }
}