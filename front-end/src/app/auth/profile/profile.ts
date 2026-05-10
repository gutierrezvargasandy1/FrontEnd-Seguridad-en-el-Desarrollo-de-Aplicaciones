import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth.service/auth';
import { LoadingService } from '../../core/interceptors/loading.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {

  user: any | null = null;
  loading = true;
  serverError = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private authService: Auth,
    private router: Router,
    public loadingService: LoadingService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  deleteUser(): void {
    if (!confirm('¿Estás seguro de eliminar tu perfil? Esta acción no se puede deshacer')) {
      return;
    }

    this.serverError = '';
    this.loading = true;

    this.authService.deleteAccount().subscribe({
      next: () => {
        this.user = null;
        this.loading = false;

        this.notification.showSuccess('Perfil eliminado exitosamente');
        this.router.navigate(['/login']);
      },

      error: (error) => {
        this.loading = false;

        const status = error?.status;

        const message =
          error?.error?.message ||
          error?.userMessage ||
          'No se pudo eliminar el perfil.';

        this.serverError = message;

        if (status === 409) {
          this.router.navigate(['dashboard/tasks']);
          return;
        }
      }
    });
  }

  loadProfile(): void {
    this.serverError = '';
    this.loading = true;

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (!user || !user.username) {
          this.serverError = 'Datos del perfil incompletos.';
          this.loading = false;
          return;
        }

        this.user = user;
        this.loading = false;
      },

      error: (error) => {
        this.loading = false;

        this.serverError =
          error?.error?.message ||
          error?.userMessage ||
          'Error al cargar el perfil.';
      }
    });
  }
}