import { Component } from '@angular/core';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {

  tasks: any[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

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

  loadTasks() {
    this.loading = true;
    this.error = '';

    this.taskService.getTasks().subscribe({
      next: (res) => {
        this.tasks = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: (err) => {
        this.error = this.extractError(err);
        this.loading = false;
      }
    });
  }

deleteTask(id: number) {
  if (!id) return;

  const confirmar = confirm('¿Estás seguro de que deseas eliminar esta tarea?');

  if (!confirmar) return;

  this.taskService.deleteTask(id).subscribe({
    next: () => {
      this.loadTasks();
    },
    error: (err) => {
      this.error = this.extractError(err);
    }
  });
}
}