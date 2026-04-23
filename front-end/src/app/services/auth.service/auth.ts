// app/features/auth/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { HttpContext } from '@angular/common/http';
import { ApiService } from '../../core/api/services/api-service';
import { LoginCredentials, RegisterData } from './interface/login-credentials.interface';
import { User } from '../user';
import { JwtHelper } from '../../utils/jwt-helper';
import { SKIP_LOADING } from '../../core/interceptors/loading.interseptor';

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly AUTH_PATH = 'auth';

  private currentUserSubject     = new BehaviorSubject<User | null>(null);
  public  currentUser$           = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public  isAuthenticated$       = this.isAuthenticatedSubject.asObservable();

  private userRoleSubject        = new BehaviorSubject<'ADMIN' | 'CLIENT' | null>(null);
  public  userRole$              = this.userRoleSubject.asObservable();

  constructor(private api: ApiService) {
    this.checkInitialAuth();
  }

  // ============ MÉTODOS PÚBLICOS ============

  login(credentials: LoginCredentials): Observable<User> {
    return this.api.post<{ access_token: string }>(
      `${this.AUTH_PATH}/login`,
      credentials
    ).pipe(
      tap(response => {
        if (response.access_token) {
          this.setAccessToken(response.access_token);
        }
      }),
      // ✅ SKIP_LOADING: el spinner ya está activo por el POST /login.
      // Sin esto, GET /me suma un segundo contador y el spinner
      // parpadea o se muestra doble.
      switchMap(() => this.getCurrentUser({ skipLoading: true }))
    );
  }

  register(userData: RegisterData): Observable<User> {
    return this.api.post<User>(
      `${this.AUTH_PATH}/register`,
      userData
    ).pipe(
      // register no devuelve token → hacemos login internamente.
      // login ya lleva SKIP_LOADING en su GET /me, pero el POST /login
      // que dispara aquí SÍ debe mostrarse (es la segunda petición visible).
      switchMap(() => this.login({
        username: userData.username,
        password: userData.password
      }))
    );
  }

  refreshToken(): Observable<{ access_token: string }> {
    return this.api.post<{ access_token: string }>(
      `${this.AUTH_PATH}/refresh`,
      {}
    ).pipe(
      tap(response => {
        if (response.access_token) {
          this.setAccessToken(response.access_token);
        }
      })
    );
  }

  logout(): Observable<void> {
    this.clearAuthData();
    return this.api.post<void>(`${this.AUTH_PATH}/logout`, {});
  }

  /**
   * @param options.skipLoading — pasar true cuando se llama internamente
   * (después de login/register) para no duplicar el contador del spinner.
   */
  getCurrentUser(options?: { skipLoading?: boolean }): Observable<User> {
    const context = options?.skipLoading
      ? new HttpContext().set(SKIP_LOADING, true)
      : undefined;

    return this.api.get<User>(`${this.AUTH_PATH}/me`, { context }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.api.put<User>(`${this.AUTH_PATH}/me`, data).pipe(
      tap(user => {
        const current = this.currentUserSubject.value;
        this.currentUserSubject.next({ ...current, ...user });
      })
    );
  }

  changePassword(data: ChangePasswordData): Observable<{ message: string }> {
    return this.api.put<{ message: string }>(`${this.AUTH_PATH}/me/password`, data);
  }

  deleteAccount(): Observable<void> {
    return this.api.delete<void>(`${this.AUTH_PATH}/delete`).pipe(
      tap(() => this.clearAuthData())
    );
  }

  // ============ GETTERS ============

  getAccessToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  setAccessToken(token: string): void {
    sessionStorage.setItem('access_token', token);
    this.extractRoleFromToken(token);
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return (
      this.isAuthenticatedSubject.value &&
      !!this.getAccessToken() &&
      !this.isTokenExpired()
    );
  }

  // ============ ROL ============

  getUserRole(): 'ADMIN' | 'CLIENT' | null {
    return this.userRoleSubject.value;
  }

  isAdmin():  boolean { return this.getUserRole() === 'ADMIN';  }
  isClient(): boolean { return this.getUserRole() === 'CLIENT'; }

  hasRole(role: 'ADMIN' | 'CLIENT'): boolean {
    return this.getUserRole() === role;
  }

  // ============ PRIVADOS ============

  private extractRoleFromToken(token: string): void {
    const role = JwtHelper.getRoleFromToken(token);

    let normalized: 'ADMIN' | 'CLIENT' | null = null;
    if (role === 'ADMIN'  || role === 'admin')  normalized = 'ADMIN';
    if (role === 'CLIENT' || role === 'client') normalized = 'CLIENT';

    this.userRoleSubject.next(normalized);
  }

  private isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    return JwtHelper.isTokenExpired(token);
  }

  private clearAuthData(): void {
    sessionStorage.removeItem('access_token');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.userRoleSubject.next(null);
  }

  private checkInitialAuth(): void {
    const token = this.getAccessToken();

    if (token && !this.isTokenExpired()) {
      this.extractRoleFromToken(token);
      // SKIP_LOADING: la verificación inicial no debe mostrar spinner
      this.getCurrentUser({ skipLoading: true }).subscribe({
        error: () => {
          this.refreshToken().subscribe({
            error: () => this.clearAuthData()
          });
        }
      });
    } else if (token && this.isTokenExpired()) {
      this.refreshToken().subscribe({
        error: () => this.clearAuthData()
      });
    }
  }
}