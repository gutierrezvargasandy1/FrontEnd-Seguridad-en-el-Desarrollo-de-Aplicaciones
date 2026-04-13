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
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url.includes('/login') || req.url.includes('/refresh')) {
      return next.handle(req);
    }

    const token = this.authService.getAccessToken();

    let authReq = req.clone({
      withCredentials: true
    });

    if (token) {
      authReq = authReq.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(

      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {

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
            }),

            catchError((refreshError) => {
              this.authService.logout();
              this.router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}