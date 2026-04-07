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

  agregarTarea() {

    // 🔥 limpiar error anterior
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

        // limpiar formulario por seguridad UX
        this.name = '';
        this.description = '';
        this.priority = false;

        this.router.navigate(['/dashboard/tasks']);
      },
      error: (err) => {
  this.loading = false;

  this.error =
    err.error?.message ||
    err.error ||
    err.message ||
    `Error HTTP ${err.status}`;

  console.error('Error creando tarea:', err);
}
    });
  }
}