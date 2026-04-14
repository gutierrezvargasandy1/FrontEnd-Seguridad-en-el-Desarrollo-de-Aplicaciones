import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { TaskService, CreateTaskDto, TaskError } from '../../services/task';

@Component({
  selector: 'app-agregar-tarea',
  standalone: false,
  templateUrl: './agregar-tarea.html',
  styleUrls: ['./agregar-tarea.css']
})
export class AgregarTarea {
  name = '';
  description = '';
  priority = false;

  loading = false;
  serverError = '';
  successMessage = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  agregarTarea(form: NgForm): void {
    this.name = this.name?.trim();    
    this.description = this.description?.trim();

    this.serverError = '';
    this.fieldErrors = {};
    this.successMessage = '';

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.loading = true;

    const nuevaTarea: CreateTaskDto = {
      name: this.name,
      description: this.description || '',
      priority: this.priority
    };

    this.taskService.createTask(nuevaTarea).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Tarea creada correctamente';
        form.resetForm();
        setTimeout(() => this.router.navigate(['/dashboard/tasks']), 1000);
      },
      error: (err: TaskError) => {
        this.loading = false;
        if (err.fieldErrors) {
          this.fieldErrors = err.fieldErrors;
        } else {
          this.serverError = err.userMessage;
        }
      }
    });
  }

  trimField(field: string): void {
    switch (field) {
      case 'name':
        this.name = this.name?.trim();
        break;
      case 'description':
        this.description = this.description?.trim();
        break;
    }
  }
}