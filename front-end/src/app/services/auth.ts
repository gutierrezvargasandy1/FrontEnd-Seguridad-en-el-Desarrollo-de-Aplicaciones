import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  lastname: string;
  username: string;
  created_at: string;
  password?: string;
}

export interface RegisterError {
  userMessage: string;
  fieldErrors?: { [key: string]: string };
}

export interface LoginError {
  userMessage: string;
  fieldErrors?: { [key: string]: string };
  originalStatus?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:3000/api/auth';
  private accessToken: string | null = null;

  constructor(private http: HttpClient) {}

  // Login
  login(username: string, password: string): Observable<void> {
    return this.http.post<any>(
      `${this.API}/login`,
      { username, password },
      { withCredentials: true }
    ).pipe(
      tap(res => this.setAccessToken(res.access_token)),
      catchError(err => this.handleLoginError(err))
    );
  }

  register(userData: {
    name: string;
    lastname: string;
    username: string;
    password: string;
  }): Observable<User> {
    return this.http.post<User>(
      `${this.API}/register`,
      userData,
      { withCredentials: true }
    ).pipe(
      catchError(err => this.handleRegisterError(err))
    );
  }

  refresh(): Observable<void> {
    return this.http.post<any>(
      `${this.API}/refresh`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(res => this.setAccessToken(res.access_token)),
      catchError(err => this.handleRefreshError(err))
    );
  }

  logout(): Observable<void> {
    this.accessToken = null;
    return this.http.post<void>(
      `${this.API}/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      catchError(err => this.handleLogoutError(err))
    );
  }

  deleteUser(): Observable<void>{
    return this.http.delete<void>(`${this.API}/delete`, { withCredentials: true })
      .pipe(catchError(err => this.handleMeError(err)));


  }

  me(): Observable<User> {
    return this.http.get<User>(`${this.API}/me`, { withCredentials: true })
      .pipe(catchError(err => this.handleMeError(err)));
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  private setAccessToken(token: string): void {
    this.accessToken = token;
  }
  
  updateProfile(data: Partial<User>): Observable<User> {
  return this.http.put<User>(
    `${this.API}/me`,
    data,
    { withCredentials: true }
  ).pipe(
    catchError(err => this.handleMeError(err))
  );
}

  // --------------------------------------------------------------
  // Manejo  de errores 
  // --------------------------------------------------------------
  private handleLoginError(err: any): Observable<never> {
    const normalized = err as { status: number; userMessage: string; originalError?: any };
    if (normalized.userMessage) {
      const fieldErrors = this.extractFieldErrorsFromOriginal(normalized.originalError);
      if (Object.keys(fieldErrors).length > 0) {
        return throwError(() => ({ userMessage: 'Errores en el formulario', fieldErrors } as LoginError));
      }
      return throwError(() => ({ userMessage: normalized.userMessage } as LoginError));
    }
    return throwError(() => ({
      userMessage: 'Error de autenticación. Intente más tarde.'
    } as LoginError));
  }

  private handleRegisterError(err: any): Observable<never> {
    const normalized = err as { status: number; userMessage: string; originalError?: any };
    if (normalized.userMessage) {
      const fieldErrors = this.extractFieldErrorsFromOriginal(normalized.originalError);
      if (Object.keys(fieldErrors).length > 0) {
        return throwError(() => ({ userMessage: 'Errores en el formulario', fieldErrors } as RegisterError));
      }
      return throwError(() => ({ userMessage: normalized.userMessage } as RegisterError));
    }
    return throwError(() => ({
      userMessage: 'Error en el registro. Intente más tarde.'
    } as RegisterError));
  }

  private handleRefreshError(err: any): Observable<never> {
    const normalized = err as { status: number; userMessage: string };
    return throwError(() => ({
      userMessage: normalized.userMessage || 'Sesión expirada. Vuelva a iniciar sesión.'
    } as LoginError));
  }

  private handleLogoutError(err: any): Observable<never> {
    console.warn('Logout error (ignored):', err);
    return throwError(() => ({ userMessage: '' } as LoginError));
  }

  private handleMeError(err: any): Observable<never> {
    const normalized = err as { status: number; userMessage: string; originalError?: any };
    if (normalized.userMessage) {
      return throwError(() => ({ userMessage: normalized.userMessage } as LoginError));
    }
    return throwError(() => ({
      userMessage: 'No se pudo cargar el perfil. Intente más tarde.'
    } as LoginError));
  }


  private extractFieldErrorsFromOriginal(originalError: any): { [key: string]: string } {
    if (!originalError) return {};
    try {
      let body = originalError.error;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }
      // Caso 1: fieldErrors ya estructurado
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
          else {
            return {};
          }
        }
        return errors;
      }
    } catch (e) {}
    return {};
  }
}