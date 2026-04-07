import { Component } from '@angular/core';
import { TaskService, CreateTaskDto } from '../../services/task';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-tarea',
  standalone: false,
  templateUrl: './agregar-tarea.html',
  styleUrls: ['./agregar-tarea.css'], // corregido styleUrl -> styleUrls
})
export class AgregarTarea {

  name: string = '';
  description: string = '';
  priority: boolean = false;
  loading: boolean = false;
  error: string = '';

  constructor(private taskService: TaskService, private router: Router) {}

  agregarTarea() {
    if (!this.name.trim()) {
      this.error = 'El nombre de la tarea es obligatorio';
      return;
    }

    this.loading = true;

    const nuevaTarea: CreateTaskDto = {
      name: this.name,
      description: this.description,
      priority: this.priority
    };

    this.taskService.createTask(nuevaTarea).subscribe({
      next: (task) => {
        this.loading = false;
        this.router.navigate(['/dashboard/tasks']); 
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al crear la tarea';
        console.error(err);
      }
    });
  }
}
