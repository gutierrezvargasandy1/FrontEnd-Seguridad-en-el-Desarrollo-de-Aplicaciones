// app/auth/register/register.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Auth } from '../../services/auth.service/auth';
import { NotificationService } from '../../services/notification.service';
import { LoadingService } from '../../core/interceptors/loading.service';
import { AppError } from '../../core/interceptors/error.interseptor';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  name = '';
  lastname = '';
  username = '';
  password = '';
  confirmPassword = '';

  serverError = '';
  fieldErrors: Record<string, string> = {};

  constructor(
    private authService: Auth,
    private router: Router,
    private notification: NotificationService,
    public loadingService: LoadingService
  ) {}

  onRegister(form: NgForm): void {
    // Limpiar estado previo
    this.serverError = '';
    this.fieldErrors = {};

    // Trim antes de validar
    this.name        = this.name.trim();
    this.lastname    = this.lastname.trim();
    this.username    = this.username.trim();

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.password !== this.confirmPassword) {
      form.form.controls['confirmPassword']?.setErrors({ notMatch: true });
      form.control.markAllAsTouched();
      return;
    }

    this.authService.register({
      name:     this.name,
      lastname: this.lastname,
      username: this.username,
      password: this.password
    }).subscribe({
      next: (user) => {
        this.notification.showSuccess(`Bienvenido ${user.name || user.username}`);
        form.resetForm();
        this.resetFields();
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err: AppError) => {
        // El interceptor ya mostró el toast — aquí solo manejamos
        // el feedback visual inline del formulario

        // Errores por campo (ej: VALIDATION_ERROR con details)
        if (err.fieldErrors) {
          this.fieldErrors = this.normalizeFieldErrors(err.fieldErrors);
        }

        // Mensaje general bajo el formulario — SIEMPRE desde userMessage
        this.serverError = err.userMessage ?? 'Ocurrió un error inesperado.';
      }
    });
  }

  trimField(field: keyof Pick<Register, 'name' | 'lastname' | 'username'>): void {
    this[field] = this[field].trim();
  }

  // ----------------------------------------------------------
  // Convierte Record<string, string | string[]> → Record<string, string>
  // y mapea el nombre de campo técnico al nombre usado en el template
  // ----------------------------------------------------------
  private normalizeFieldErrors(
    details: Record<string, string | string[]>
  ): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [field, messages] of Object.entries(details)) {
      const key     = this.mapFieldName(field);
      result[key]   = Array.isArray(messages) ? messages.join(', ') : messages;
    }

    return result;
  }

  // Mapea el nombre técnico del backend al nombre de la propiedad del template
  private mapFieldName(field: string): string {
    const fieldMap: Record<string, string> = {
      name:     'name',
      lastname: 'lastname',
      username: 'username',
      password: 'password',
      email:    'username',   // si el backend lo envía como 'email'
    };
    return fieldMap[field] ?? field;
  }

  private resetFields(): void {
    this.name            = '';
    this.lastname        = '';
    this.username        = '';
    this.password        = '';
    this.confirmPassword = '';
  }
}