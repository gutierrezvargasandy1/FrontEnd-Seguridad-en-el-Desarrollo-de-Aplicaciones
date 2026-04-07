import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Task {
  id: number;
  name: string;             // coincide con Prisma
  description?: string;
  priority: boolean;
  created_at: string;
  user_id: number;
}

export interface CreateTaskDto {
  name: string;
  description: string;
  priority: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private API = 'http://localhost:3000/api/task';

  constructor(private http: HttpClient) {}

  /** Obtener todas las tareas */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.API, { withCredentials: true });
  }

  /** Obtener tarea por ID */
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.API}/${id}`, { withCredentials: true });
  }

  /** Crear nueva tarea */
  createTask(task: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(this.API, task, { withCredentials: true });
  }

  /** Actualizar tarea existente */
  updateTask(id: number, task: Partial<CreateTaskDto>): Observable<Task> {
    return this.http.put<Task>(`${this.API}/${id}`, task, { withCredentials: true });
  }

  /** Borrar tarea */
  deleteTask(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.API}/${id}`, { withCredentials: true });
  }
}
