import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  lastname: string;
  username: string;
  created_at: string | Date;
  hash?: string | null;
}

export interface CreateUserDto {
  name: string;
  lastname: string;
  username: string;
  password: string;
}

export interface UpdateUserDto {
  name: string;
  lastname: string;
  username: string;
}

export interface UserError {
  userMessage: string;
  fieldErrors?: { [key: string]: string };
}

@Injectable({ providedIn: 'root' })
export class UserService {

  private readonly API = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  // ✅ POST
  createUser(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${this.API}`, user, { withCredentials: true })
      .pipe(catchError(err => this.handleUserError(err)));
  }

  // ✅ GET ALL
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API}`, { withCredentials: true })
      .pipe(catchError(err => this.handleUserError(err)));
  }

  // ✅ GET BY ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API}/${id}`, { withCredentials: true })
      .pipe(catchError(err => this.handleUserError(err)));
  }

  // ✅ PATCH
  updateUser(id: number, user: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(`${this.API}/${id}`, user, { withCredentials: true })
      .pipe(catchError(err => this.handleUserError(err)));
  }

  // ✅ DELETE
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`, { withCredentials: true })
      .pipe(catchError(err => this.handleUserError(err)));
  }

  // --------------------------------------------------------------
  // Manejo de errores
  // --------------------------------------------------------------
  private handleUserError(err: any): Observable<never> {
    const normalized = err as { status: number; userMessage: string; originalError?: any };

    if (normalized.userMessage) {
      const fieldErrors = this.extractFieldErrorsFromOriginal(normalized.originalError);

      if (Object.keys(fieldErrors).length > 0) {
        return throwError(() => ({
          userMessage: 'Errores en el formulario',
          fieldErrors
        } as UserError));
      }

      return throwError(() => ({
        userMessage: normalized.userMessage
      } as UserError));
    }

    return throwError(() => ({
      userMessage: 'Error en la operación. Intente más tarde.'
    } as UserError));
  }

  private extractFieldErrorsFromOriginal(originalError: any): { [key: string]: string } {
    if (!originalError) return {};

    try {
      let body = originalError.error;

      if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      if (body?.fieldErrors && typeof body.fieldErrors === 'object') {
        const sanitized: { [key: string]: string } = {};
        for (const [key, value] of Object.entries(body.fieldErrors)) {
          sanitized[key] = String(value).replace(/<[^>]*>/g, '').slice(0, 200);
        }
        return sanitized;
      }

      if (Array.isArray(body?.message) && body.message.length) {
        const errors: { [key: string]: string } = {};

        for (const msg of body.message) {
          const lowerMsg = msg.toLowerCase();

          if (lowerMsg.includes('nombre')) errors['name'] = msg;
          else if (lowerMsg.includes('apellido')) errors['lastname'] = msg;
          else if (lowerMsg.includes('usuario') || lowerMsg.includes('username')) errors['username'] = msg;
          else if (lowerMsg.includes('contraseña') || lowerMsg.includes('password')) errors['password'] = msg;
        }

        return errors;
      }

    } catch {}

    return {};
  }
}