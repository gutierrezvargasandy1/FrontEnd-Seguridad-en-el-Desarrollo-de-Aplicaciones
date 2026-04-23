import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpContextToken
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from './loading.service';

export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const loadingService = this.injector.get(LoadingService);

    if (req.context.get(SKIP_LOADING)) {
      return next.handle(req);
    }

    loadingService.show();

    return next.handle(req).pipe(
      finalize(() => loadingService.hide())
    );
  }
}