import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TasksModule } from './tasks/tasks-module';
import { AuthModule } from './auth/auth-module';
import { UsersModule } from './users/users-module';

@NgModule({
  declarations: [
    App,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    TasksModule,
    AuthModule,
    UsersModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
     {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }

  ],
  bootstrap: [App]
})
export class AppModule { }
