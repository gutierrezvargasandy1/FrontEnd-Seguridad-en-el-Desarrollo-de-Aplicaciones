import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task'; // si tienes un servicio para tareas

@Component({
  selector: 'app-tarea-details',
  standalone: false,
  templateUrl: './tarea-details.html',
  styleUrl: './tarea-details.css',
})
export class TareaDetails {

  taskId!: number;
  task: any;

  constructor(private route: ActivatedRoute, private tareasService: TaskService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.taskId = Number(params.get('id'));
      this.loadTask();

    });
  }

loadTask() {
  this.tareasService.getTaskById(this.taskId).subscribe({
    next: (t) => {
      this.task = {
        name: t?.name || 'Sin nombre',
        description: t?.description || 'No hay descripción',
        priority: t?.priority ? 'Prioridad' : 'Normal',
        createdAt: t?.created_at || new Date(),
        completed: t?.created_at ?? false
      };
    },
    error: (err) => {
      console.error('Error cargando la tarea', err);
    }
  });
}

}