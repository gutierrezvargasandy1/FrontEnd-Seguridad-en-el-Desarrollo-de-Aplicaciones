import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  if (req.url.includes('/login') || req.url.includes('/refresh')) {
    return next.handle(req);
  }

  const token = this.authService.getAccessToken();

  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  authReq = authReq.clone({
    withCredentials: true
  });

  return next.handle(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Intentar refrescar token
        return this.authService.refresh().pipe(
          switchMap(() => {
            const newToken = this.authService.getAccessToken();
            const newRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              },
              withCredentials: true
            });
            return next.handle(newRequest);
          })
        );
      }
      return throwError(() => error);
    })
  );
  }}
