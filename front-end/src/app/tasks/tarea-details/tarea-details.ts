import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService, Task, TaskError } from '../../services/task';

@Component({
  selector: 'app-tarea-details',
  standalone: false,
  templateUrl: './tarea-details.html',
  styleUrls: ['./tarea-details.css']
})
export class TareaDetails implements OnInit {
  taskId!: number;
  task: {
    name: string;
    description: string;
    priority: string;
    createdAt: Date;
  } | null = null;
  loading = false;
  serverError = '';

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (!idParam || isNaN(Number(idParam))) {
        this.serverError = 'ID de tarea inválido.';
        return;
      }
      this.taskId = Number(idParam);
      this.loadTask();
    });
  }

  loadTask(): void {
    this.loading = true;
    this.serverError = '';

    this.taskService.getTaskById(this.taskId).subscribe({
      next: (t: Task) => {
        if (!t) {
          this.serverError = 'La tarea no existe.';
          this.loading = false;
          return;
        }
        this.task = {
          name: t.name || 'Sin nombre',
          description: t.description || 'No hay descripción',
          priority: t.priority ? 'Alta' : 'Normal',
          createdAt: new Date(t.created_at)
        };
        this.loading = false;
      },
      error: (err: TaskError) => {
        this.serverError = err.userMessage;
        this.loading = false;
      }
    });
  }
}