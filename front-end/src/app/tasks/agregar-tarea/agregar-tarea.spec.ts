import { Component } from '@angular/core';
import { TaskService, CreateTaskDto } from '../../services/task';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-tarea',
  standalone: false,
  templateUrl: './agregar-tarea.html',
  styleUrls: ['./agregar-tarea.css'],
})
export class AgregarTarea {

  name: string = '';
  description: string = '';
  priority: boolean = false;
  loading: boolean = false;
  error: string = '';

  constructor(private taskService: TaskService, private router: Router) {}

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

  agregarTarea() {
    this.error = '';

    if (!this.name.trim()) {
      this.error = 'El nombre de la tarea es obligatorio';
      return;
    }

    this.loading = true;

    const nuevaTarea: CreateTaskDto = {
      name: this.name.trim(),
      description: this.description?.trim() || '',
      priority: this.priority
    };

    this.taskService.createTask(nuevaTarea).subscribe({
      next: () => {
        this.loading = false;
        this.name = '';
        this.description = '';
        this.priority = false;
        this.router.navigate(['/dashboard/tasks']);
      },
      error: (err) => {
        this.error = this.extractError(err);
        this.loading = false;
      }
    });
  }
}