import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../core/api/services/api-service';
import { Task } from './interface/task.interface';
import { CreateTaskDto } from './interface/create-task-dto.interface';
import { ErrorResponse } from '../error-response.interface';
import { AppError } from '../../core/interceptors/error.interseptor';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly endpoint = 'task';

  constructor(
    private api: ApiService
  ) {}

  getTasks(): Observable<Task[]> {

    return this.api
      .get<Task[]>(this.endpoint)
      .pipe(
        catchError(error =>
          this.handleTaskError(error)
        )
      );
  }

  getTaskById(id: number): Observable<Task> {

    return this.api
      .get<Task>(`${this.endpoint}/${id}`)
      .pipe(
        catchError(error =>
          this.handleTaskError(error)
        )
      );
  }

  createTask(task: CreateTaskDto): Observable<Task> {

    return this.api
      .post<Task>(
        this.endpoint,
        task
      )
      .pipe(
        catchError(error =>
          this.handleTaskError(error)
        )
      );
  }

  updateTask(
    id: number,
    task: Partial<CreateTaskDto>
  ): Observable<Task> {

    return this.api
      .put<Task>(
        `${this.endpoint}/${id}`,
        task
      )
      .pipe(
        catchError(error =>
          this.handleTaskError(error)
        )
      );
  }

  deleteTask(id: number): Observable<boolean> {

    return this.api
      .delete<boolean>(
        `${this.endpoint}/${id}`
      )
      .pipe(
        catchError(error =>
          this.handleTaskError(error)
        )
      );
  }

  private handleTaskError(
    error: AppError
  ): Observable<never> {

    const taskError: ErrorResponse = {

      userMessage:
        error.userMessage,

      fieldErrors:
        this.normalizeFieldErrors(
          error.fieldErrors
        )
    };

    return throwError(() => taskError);
  }

  private normalizeFieldErrors(
    fieldErrors:
      Record<string, string | string[]> | null
  ): { [key: string]: string } {

    if (!fieldErrors) {
      return {};
    }

    const normalized: {
      [key: string]: string
    } = {};

    for (
      const [field, value]
      of Object.entries(fieldErrors)
    ) {

      normalized[field] =
        Array.isArray(value)
          ? value.join(', ')
          : value;
    }

    return normalized;
  }
}