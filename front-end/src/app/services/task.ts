import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Task {
  id: number;
  name: string;
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

export interface TaskError {
  userMessage: string;
  fieldErrors?: { [key: string]: string };
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly API = 'http://localhost:3000/api/task';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.API, { withCredentials: true })
      .pipe(catchError(err => this.handleTaskError(err)));
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.API}/${id}`, { withCredentials: true })
      .pipe(catchError(err => this.handleTaskError(err)));
  }

  createTask(task: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(this.API, task, { withCredentials: true })
      .pipe(catchError(err => this.handleTaskError(err)));
  }

  updateTask(id: number, task: Partial<CreateTaskDto>): Observable<Task> {
    return this.http.put<Task>(`${this.API}/${id}`, task, { withCredentials: true })
      .pipe(catchError(err => this.handleTaskError(err)));
  }

  deleteTask(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.API}/${id}`, { withCredentials: true })
      .pipe(catchError(err => this.handleTaskError(err)));
  }

  // --------------------------------------------------------------
  // Manejo de errores para tareas
  // --------------------------------------------------------------
  private handleTaskError(err: any): Observable<never> {
    const normalized = err as { status: number; userMessage: string; originalError?: any };
    if (normalized.userMessage) {
      const fieldErrors = this.extractFieldErrorsFromOriginal(normalized.originalError);
      if (Object.keys(fieldErrors).length > 0) {
        return throwError(() => ({ userMessage: 'Errores en el formulario', fieldErrors } as TaskError));
      }
      return throwError(() => ({ userMessage: normalized.userMessage } as TaskError));
    }
    return throwError(() => ({
      userMessage: 'Error al procesar la tarea. Intente más tarde.'
    } as TaskError));
  }

  private extractFieldErrorsFromOriginal(originalError: any): { [key: string]: string } {
  if (!originalError) return {};
  try {
    const body = typeof originalError.error === 'string'
      ? JSON.parse(originalError.error)
      : originalError.error;
    
    // Manejar array de mensajes (como el de la imagen)
    if (Array.isArray(body?.message) && body.message.length > 0) {
      const errors: { [key: string]: string } = {};
      for (const msg of body.message) {
        const lowerMsg = msg.toLowerCase();
        if (lowerMsg.includes('descripción')) {
          errors['description'] = msg;
        } else if (lowerMsg.includes('nombre')) {
          errors['name'] = msg;
        } else {
          // Si no podemos asociarlo, lo dejamos como error global (no fieldErrors)
          return {};
        }
      }
      return errors;
    }
    
    // Formato fieldErrors estándar
    if (body?.fieldErrors && typeof body.fieldErrors === 'object') {
      const sanitized: { [key: string]: string } = {};
      for (const [key, value] of Object.entries(body.fieldErrors)) {
        sanitized[key] = String(value).replace(/<[^>]*>/g, '').slice(0, 200);
      }
      return sanitized;
    }
  } catch (e) {}
  return {};
}
}