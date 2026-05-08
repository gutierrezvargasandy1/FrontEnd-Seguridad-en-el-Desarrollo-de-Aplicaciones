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

import { Router } from '@angular/router';

import {
  Observable,
  throwError,
  BehaviorSubject
} from 'rxjs';

import {
  catchError,
  filter,
  take,
  switchMap,
  finalize
} from 'rxjs/operators';

import { Auth } from '../../services/auth.service/auth';

// ================= TOKEN PARA OMITIR REFRESH =================

export const SKIP_REFRESH =
  new HttpContextToken<boolean>(() => false);

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // ================= CONTROL REFRESH =================

  private isRefreshing = false;

  private refreshTokenSubject:
    BehaviorSubject<string | null> =
      new BehaviorSubject<string | null>(null);

  constructor(private injector: Injector) {}

  // ================= INTERCEPT =================

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const authService = this.injector.get(Auth);

    // ================= VALIDAR AUTH ENDPOINT =================

    const isAuthEndpoint =
      this.isAuthEndpoint(req.url);

    const skipRefresh =
      req.context.get(SKIP_REFRESH);

    // ================= OBTENER ACCESS TOKEN =================

    const accessToken =
      authService.getAccessToken();

    // ================= CLONAR REQUEST =================

    let authReq = req;

    if (accessToken && !isAuthEndpoint) {

      authReq =
        this.addTokenToRequest(req, accessToken);
    }

    // ================= EJECUTAR REQUEST =================

    return next.handle(authReq).pipe(

      catchError((error: HttpErrorResponse) => {

        // ================= SOLO MANEJAR 401 =================

        if (
          error.status === 401 &&
          !isAuthEndpoint &&
          !skipRefresh
        ) {

          return this.handle401Error(
            authReq,
            next,
            authService
          );
        }

        return throwError(() => error);
      })
    );
  }

  // ================= VALIDAR AUTH ENDPOINTS =================

  private isAuthEndpoint(url: string): boolean {

    const authEndpoints = [

      '/auth/login',

      '/auth/register',

      '/auth/refresh',

      '/auth/logout'
    ];

    return authEndpoints.some(endpoint =>
      url.includes(endpoint)
    );
  }

  // ================= AGREGAR TOKEN =================

  private addTokenToRequest(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {

    return request.clone({

      setHeaders: {

        Authorization: `Bearer ${token}`
      }
    });
  }

  // ================= MANEJO 401 =================

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler,
    authService: Auth
  ): Observable<HttpEvent<any>> {

    const router = this.injector.get(Router);

    // ================= SI NO HAY REFRESH EN CURSO =================

    if (!this.isRefreshing) {

      this.isRefreshing = true;

      this.refreshTokenSubject.next(null);

      return authService.refreshToken().pipe(

        // ================= REFRESH EXITOSO =================

        switchMap((response: { access_token: string }) => {

          // Guardar nuevo access token
          authService.setAccessToken(
            response.access_token
          );

          // Despertar requests en espera
          this.refreshTokenSubject.next(
            response.access_token
          );

          // Reintentar request original
          return next.handle(

            this.addTokenToRequest(
              request,
              response.access_token
            )
          );
        }),

        // ================= REFRESH FALLÓ =================

        catchError((refreshError) => {

          console.error(
            'Refresh token inválido:',
            refreshError
          );

          // Reset refresh subject
          this.refreshTokenSubject.next(null);

          // Limpiar sesión
          authService.logout();

          // Redirigir login
          router.navigate(['/login']);

          return throwError(() => refreshError);
        }),

        // ================= FINALIZE =================

        finalize(() => {

          this.isRefreshing = false;
        })
      );
    }

    // ================= SI YA HAY REFRESH =================

    return this.refreshTokenSubject.pipe(

      filter(token => token !== null),

      take(1),

      switchMap(token =>

        next.handle(

          this.addTokenToRequest(
            request,
            token!
          )
        )
      )
    );
  }
}