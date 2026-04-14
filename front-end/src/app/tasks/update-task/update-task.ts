import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { TaskService, TaskError } from '../../services/task';

@Component({
  selector: 'app-update-task',
  standalone: false,
  templateUrl: './update-task.html',
  styleUrls: ['./update-task.css']
})
export class UpdateTask implements OnInit {
  name = '';
  description = '';
  priority = false;

  taskId!: number;
  loading = false;
  successMessage = '';
  serverError = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || isNaN(Number(idParam))) {
      this.serverError = 'ID de tarea inválido.';
      return;
    }
    this.taskId = Number(idParam);

    this.taskService.getTaskById(this.taskId).subscribe({
      next: (task) => {
        if (!task) {
          this.serverError = 'La tarea no existe.';
          return;
        }
        this.name = task.name;
        this.description = task.description || '';
        this.priority = task.priority;
      },
      error: (err: TaskError) => {
        this.serverError = err.userMessage;
      }
    });
  }

  onSubmit(form: NgForm): void {
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

    const updatedTask = {
      name: this.name,
      description: this.description || '',
      priority: this.priority
    };

    this.taskService.updateTask(this.taskId, updatedTask).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Tarea actualizada correctamente';
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