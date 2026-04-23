// app/app-module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TasksModule } from './tasks/tasks-module';
import { AuthModule } from './auth/auth-module';
import { UsersModule } from './users/users-module';

// Servicios
import { NotificationService } from './services/notification.service';
import { ApiService } from './core/api/services/api-service';
import { LoadingService } from './core/interceptors/loading.service';
import { LoadingInterceptor } from './core/interceptors/loading.interseptor';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interseptor';
import { AuditLogService } from './services/audit-log.service';
import { AuditModule } from './auditLog/auditLog-module';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    TasksModule,
    AuthModule,
    UsersModule,
    AuditModule
  ],
  providers: [
    // ============ SERVICIOS GLOBALES ============
    LoadingService,
    NotificationService,
    ApiService,
    
    // ============ INTERCEPTORES (orden importante) ============
    // 1. AuthInterceptor: Mete el JWT en cada petición
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    // 2. LoadingInterceptor: Maneja el estado de carga
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    // 3. ErrorInterceptor: Normalización de errores HTTP
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [App]
})
export class AppModule { }