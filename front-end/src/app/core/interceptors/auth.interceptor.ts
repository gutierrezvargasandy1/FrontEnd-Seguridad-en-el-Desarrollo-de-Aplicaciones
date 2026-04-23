// app/core/interceptors/auth.interceptor.ts
import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpContextToken
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { Auth } from '../../services/auth.service/auth';

// Token para omitir refresh en peticiones específicas
export const SKIP_REFRESH = new HttpContextToken<boolean>(() => false);

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.injector.get(Auth);
    
    // Excluir endpoints de autenticación
    const isAuthEndpoint = this.isAuthEndpoint(req.url);
    const skipRefresh = req.context.get(SKIP_REFRESH);
    
    // Obtener token de sessionStorage
    const accessToken = authService.getAccessToken();

    // Clonar request con el token si existe y no es endpoint de auth
    let authReq = req;
    if (accessToken && !isAuthEndpoint) {
      authReq = this.addTokenToRequest(req, accessToken);
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Solo manejar 401, que no sea endpoint de auth, y que no tenga skipRefresh
        if (error.status === 401 && !isAuthEndpoint && !skipRefresh) {
          return this.handle401Error(authReq, next, authService);
        }
        
        return throwError(() => error);
      })
    );
  }

  private isAuthEndpoint(url: string): boolean {
    const authEndpoints = [
      '/auth/login',
      '/auth/register',
      '/auth/refresh',
      '/auth/logout'
    ];
    return authEndpoints.some(endpoint => url.includes(endpoint));
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler,
    authService: Auth
  ): Observable<HttpEvent<any>> {
    
    // Si no se está refrescando, iniciar el proceso
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return authService.refreshToken().pipe(
        switchMap((response: { access_token: string }) => {
          // Guardar nuevo token
          authService.setAccessToken(response.access_token);
          // Notificar a todas las peticiones encoladas
          this.refreshTokenSubject.next(response.access_token);
          // Reintentar la petición original con el nuevo token
          return next.handle(this.addTokenToRequest(request, response.access_token));
        }),
        catchError((refreshError) => {
          // Si falla el refresh, hacer logout
          this.refreshTokenSubject.next(null);
          authService.logout().subscribe();
          return throwError(() => refreshError);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    } else {
      // Si ya se está refrescando, esperar el nuevo token
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.addTokenToRequest(request, token!)))
      );
    }
  }
}