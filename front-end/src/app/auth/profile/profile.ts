// app/dashboard/profile/profile.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth.service/auth';  // ← Tu ruta exacta
import { LoadingService } from '../../core/interceptors/loading.service';
import { NotificationService } from '../../services/notification.service';
import { TaskService } from '../../services/task';

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
  tasks: any[] = [];

  constructor(
    private authService: Auth,  // ← Nuevo servicio
    private router: Router,
    private taskService: TaskService,
    public loadingService: LoadingService,  // ← Loading service
    private notification: NotificationService  // ← Notificaciones
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  deleteUser(): void {
    if (!confirm('¿Estás seguro de eliminar tu perfil? Esta acción no se puede deshacer')) {
      return;
    }

    this.serverError = '';

    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        if (tasks.length > 0) {
          this.loading = false;
          this.serverError = 'No puedes eliminar el perfil mientras existan tareas asociadas.';
          this.notification.showError(this.serverError);
          this.router.navigate(['dashboard/tasks']);
          return;
        }

        this.authService.deleteAccount().subscribe({
          next: () => {
            this.user = null;
            this.notification.showSuccess('Perfil eliminado exitosamente');
            this.router.navigate(['/login']);
          },
          error: (error) => {
            // El ErrorInterceptor ya maneja la notificación
            this.serverError = error.userMessage || error.error?.message || 'Error al eliminar el perfil.';
            this.loading = false;
          }
        });
      },
      error: (error) => {
        this.serverError = 'Error al verificar las tareas del usuario.';
        this.notification.showError(this.serverError);
        this.loading = false;
      }
    });
  }

  loadProfile(): void {
    this.serverError = '';

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
        // El ErrorInterceptor ya maneja la notificación
        this.serverError = error.userMessage || error.error?.message || 'Error al cargar el perfil.';
        this.loading = false;
      }
    });
  }
}