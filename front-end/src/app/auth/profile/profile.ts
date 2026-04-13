import { Component, OnInit } from '@angular/core';
import { AuthService, User, LoginError } from '../../services/auth';
import { TaskService } from '../../services/task';
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
  tasks: any[] = [];

  constructor(private authService: AuthService, private router: Router, private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  deleteUser(): void {
  if (!confirm('Estas Seguro de eliminar tu perfil? Esta acción no se puede deshacer')) {
    return;
  }

  this.loading = true;
  this.serverError = '';

  this.taskService.getTasks().subscribe({
    next: (tasks) => {

      if (tasks.length > 0) {
        this.loading = false;
        this.serverError = 'No puedes eliminar el perfil mientras existan tareas asociadas.';
        this.router.navigate(['/tasks']);
        alert(this.serverError);

        return;
      }

      // 👇 SOLO SI NO TIENE TAREAS
      this.authService.deleteUser().subscribe({
        next: () => {
          this.user = null;
          this.loading = false;
          alert('Perfil eliminado exitosamente');
          this.router.navigate(['/login']);
        },
        error: (error: LoginError) => {
          this.serverError = error.userMessage || 'Error al eliminar el perfil.';
          this.loading = false;
        }
      });

    },
    error: () => {
      this.serverError = 'Error al verificar las tareas del usuario.';
      this.loading = false;
    }
  });
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