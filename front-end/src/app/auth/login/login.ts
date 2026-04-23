import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Auth } from '../../services/auth.service/auth';
import { LoadingService } from '../../core/interceptors/loading.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  username = '';
  password = '';
  serverError = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private authService: Auth,
    private router: Router,
    public loadingService: LoadingService,
    private notification: NotificationService
  ) {}

  onLogin(form: NgForm): void {
    this.serverError = '';
    this.fieldErrors = {};

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (user) => {
        this.notification.showSuccess(`Bienvenido ${user.name || user.username}`);
        this.redirectByRole();
      },
      error: (err) => {


  
        if (err.fieldErrors && typeof err.fieldErrors === 'object') {
          this.fieldErrors = this.extractFieldErrors(err.fieldErrors);
        }

        // Mensaje de error para mostrar bajo el formulario
        // Usamos SIEMPRE userMessage (ya traducido por el interceptor)
        this.serverError = err.userMessage ?? 'Ocurrió un error inesperado.';
      }
    });
  }

  private redirectByRole(): void {
    const role = this.authService.getUserRole();
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/dashboard/users']);
        break;
      case 'CLIENT':
      default:
        this.router.navigate(['/dashboard/tasks']);
        break;
    }
  }

  private extractFieldErrors(details: Record<string, any>): { [key: string]: string } {
    const errors: { [key: string]: string } = {};
    for (const [field, message] of Object.entries(details)) {
      const key = this.mapFieldName(field);
      errors[key] = Array.isArray(message) ? message.join(', ') : String(message);
    }
    return errors;
  }

  private mapFieldName(field: string): string {
    const fieldMap: Record<string, string> = {
      username: 'username',
      password: 'password'
    };
    return fieldMap[field] ?? field;
  }
}