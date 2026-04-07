import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-tarea-details',
  standalone: false,
  templateUrl: './tarea-details.html',
  styleUrl: './tarea-details.css',
})
export class TareaDetails {

  taskId!: number;
  task: any;
  loading: boolean = false;
  error: string = '';

  constructor(private route: ActivatedRoute, private tareasService: TaskService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (!idParam || isNaN(Number(idParam))) {
        this.error = 'ID de tarea inválido.';
        return;
      }
      this.taskId = Number(idParam);
      this.loadTask();
    });
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

  loadTask() {
    this.loading = true;
    this.error = '';

    this.tareasService.getTaskById(this.taskId).subscribe({
      next: (t) => {
        if (!t) {
          this.error = 'La tarea no existe.';
          this.loading = false;
          return;
        }
        this.task = {
          name: t?.name || 'Sin nombre',
          description: t?.description || 'No hay descripción',
          priority: t?.priority ? 'Prioridad' : 'Normal',
          createdAt: t?.created_at || new Date(),
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = this.extractError(err);
        this.loading = false;
      }
    });
  }
}