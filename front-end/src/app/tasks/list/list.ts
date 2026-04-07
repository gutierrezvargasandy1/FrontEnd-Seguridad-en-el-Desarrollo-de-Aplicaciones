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

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (res) => this.tasks = res,
      error: (err) => console.error(err)
    });
        console.log(this.tasks);

  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.loadTasks();
    });
  }
}