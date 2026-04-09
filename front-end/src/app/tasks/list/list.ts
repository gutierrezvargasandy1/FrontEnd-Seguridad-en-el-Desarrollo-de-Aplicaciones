import { Component, OnInit } from '@angular/core';
import { TaskService, Task, TaskError } from '../../services/task';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class List implements OnInit {
  tasks: Task[] = [];
  loading = false;
  serverError = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.serverError = '';

    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: (err: TaskError) => {
        this.serverError = err.userMessage;
        this.loading = false;
      }
    });
  }

  deleteTask(id: number): void {
    if (!id) return;
    const confirmar = confirm('¿Estás seguro de que deseas eliminar esta tarea?');
    if (!confirmar) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (err: TaskError) => {
        this.serverError = err.userMessage;
      }
    });
  }
}