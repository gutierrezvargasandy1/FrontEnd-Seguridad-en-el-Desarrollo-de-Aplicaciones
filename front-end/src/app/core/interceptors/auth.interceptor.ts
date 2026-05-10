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

// ================= SKIP REFRESH =================

export const SKIP_REFRESH =
  new HttpContextToken<boolean>(() => false);

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;

  private refreshTokenSubject =
    new BehaviorSubject<string | null>(null);

  constructor(private injector: Injector) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const authService = this.injector.get(Auth);

    const isAuthEndpoint = this.isAuthEndpoint(req.url);
    const skipRefresh = req.context.get(SKIP_REFRESH);
    const accessToken = authService.getAccessToken();

    // ================= AUTO REFRESH =================
    if (
      accessToken &&
      !isAuthEndpoint &&
      !skipRefresh &&
      this.shouldRefreshToken(accessToken)
    ) {
      return this.refreshAccessToken(req, next, authService);
    }

    // ================= ADD TOKEN =================
    let authReq = req;

    if (accessToken && !isAuthEndpoint) {
      authReq = this.addTokenToRequest(req, accessToken);
    }

    // ================= REQUEST =================
    return next.handle(authReq).pipe(

      catchError((error: HttpErrorResponse) => {

        // ================= NO AUTH =================
        if (isAuthEndpoint || skipRefresh) {
          return throwError(() => error);
        }

        // ================= 401 HANDLER =================
        if (error.status === 401) {

          const isRefreshCall =
            req.url.includes('/auth/refresh');

          if (!isRefreshCall && !this.isRefreshing) {
            return this.handle401Error(authReq, next, authService);
          }

          return throwError(() => error);
        }

        // ================= OTROS ERRORES (409, 500, etc) =================
        return throwError(() => error);
      })
    );
  }

  // ================= CHECK EXPIRATION =================
  private shouldRefreshToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return false;

      const expiration = payload.exp * 1000;
      const now = Date.now();
      const oneMinute = 60 * 1000;

      return expiration - now <= oneMinute;
    } catch {
      return false;
    }
  }

  // ================= REFRESH =================
  private refreshAccessToken(
    request: HttpRequest<any>,
    next: HttpHandler,
    authService: Auth
  ): Observable<HttpEvent<any>> {

    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token =>
          next.handle(this.addTokenToRequest(request, token!))
        )
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(

      switchMap((res: any) => {

        const newToken = res.access_token;

        authService.setAccessToken(newToken);
        this.refreshTokenSubject.next(newToken);

        return next.handle(
          this.addTokenToRequest(request, newToken)
        );
      }),

      catchError((err) => {
        const router = this.injector.get(Router);

        this.refreshTokenSubject.next(null);


        return throwError(() => err);
      }),

      finalize(() => {
        this.isRefreshing = false;
      })
    );
  }

  // ================= 401 HANDLER =================
  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler,
    authService: Auth
  ): Observable<HttpEvent<any>> {

    const router = this.injector.get(Router);

    if (!this.isRefreshing) {

      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return authService.refreshToken().pipe(

        switchMap((res: any) => {

          const token = res.access_token;

          authService.setAccessToken(token);
          this.refreshTokenSubject.next(token);

          return next.handle(
            this.addTokenToRequest(request, token)
          );
        }),

        catchError((err) => {

          this.refreshTokenSubject.next(null);

          router.navigate(['/login']);

          return throwError(() => err);
        }),

        finalize(() => {
          this.isRefreshing = false;
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token =>
        next.handle(this.addTokenToRequest(request, token!))
      )
    );
  }

  // ================= AUTH ENDPOINTS =================
  private isAuthEndpoint(url: string): boolean {
    return [
      '/auth/login',
      '/auth/register',
      '/auth/refresh',
      '/auth/logout'
    ].some(e => url.includes(e));
  }

  // ================= ADD TOKEN =================
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
}