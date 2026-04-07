import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, TaskService } from '../../services/task';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-task',
  standalone: false,
  templateUrl: './update-task.html',
  styleUrl: './update-task.css',
})
export class UpdateTask {
  taskForm!: FormGroup;
  taskId!: number;
  loading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      priority: [false]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || isNaN(Number(idParam))) {
      this.message = 'ID de tarea inválido.';
      return;
    }

    this.taskId = Number(idParam);

    this.taskService.getTaskById(this.taskId).subscribe({
      next: (task: Task) => {
        if (!task) {
          this.message = 'La tarea no existe.';
          return;
        }
        this.taskForm.patchValue(task);
      },
      error: (err) => {
        this.message = this.extractError(err);
      }
    });
  }

  submit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.message = '';

    this.taskService.updateTask(this.taskId, this.taskForm.value).subscribe({
      next: () => {
        this.message = 'Tarea actualizada correctamente';
        this.loading = false;
        this.router.navigate(['/dashboard/tasks']);
      },
      error: (err) => {
        this.message = this.extractError(err);
        this.loading = false;
      }
    });
  }
}