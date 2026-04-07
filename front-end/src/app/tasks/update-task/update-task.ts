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

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      priority: [false]
    });

    // Obtener ID de la URL
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));

    // Cargar datos de la tarea
    this.taskService.getTaskById(this.taskId).subscribe((task: Task) => {
      this.taskForm.patchValue(task);
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
        this.router.navigate(['/dashboard/tasks'])

      },
      error: () => {
        this.message = 'Error al actualizar la tarea';
        this.loading = false;
      }
    });
  }
}
