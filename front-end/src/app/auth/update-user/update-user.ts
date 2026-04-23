// app/dashboard/profile/update-user/update-user.ts
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, ChangePasswordData } from '../../services/auth.service/auth';
import { LoadingService } from '../../core/interceptors/loading.service';
import { NotificationService } from '../../services/notification.service';
import { AppError } from '../../core/interceptors/error.interseptor';

@Component({
  selector: 'app-update-user',
  standalone: false,
  templateUrl: './update-user.html',
  styleUrls: ['./update-user.css'],
})
export class UpdateUser implements OnInit {
  // Datos del perfil
  name = '';
  lastname = '';
  username = '';

  // Datos para cambio de contraseña
  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';

  // Estados
  serverError = '';
  fieldErrors: Record<string, string> = {};
  showPasswordForm = false;

  constructor(
    private authService: Auth,
    private router: Router,
    public loadingService: LoadingService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  // ============ CARGAR USUARIO ============
  loadUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.name     = user.name;
        this.lastname = user.lastname;
        this.username = user.username;
      },
      error: (err: AppError) => {
        // El interceptor ya mostró el toast
        this.serverError = err.userMessage ?? 'Error al cargar el perfil.';
      }
    });
  }

  // ============ ACTUALIZAR PERFIL ============
  onUpdate(form: NgForm): void {
    this.clearState();

    this.name     = this.name.trim();
    this.lastname = this.lastname.trim();
    this.username = this.username.trim();

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.authService.updateProfile({
      name:     this.name,
      lastname: this.lastname,
      username: this.username
    }).subscribe({
      next: () => {
        this.notification.showSuccess('Perfil actualizado correctamente');
        setTimeout(() => this.router.navigate(['/dashboard/profile']), 1500);
      },
      error: (err: AppError) => {
        // El interceptor ya mostró el toast
        if (err.fieldErrors) {
          this.fieldErrors = this.normalizeFieldErrors(err.fieldErrors);
        }
        this.serverError = err.userMessage ?? 'No pudimos actualizar el perfil.';
      }
    });
  }

  // ============ CAMBIAR CONTRASEÑA ============
  onChangePassword(form: NgForm): void {
    this.clearState();

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      this.serverError = 'Las contraseñas nuevas no coinciden.';
      return;
    }

    this.authService.changePassword({
      currentPassword: this.currentPassword,
      newPassword:     this.newPassword
    }).subscribe({
      next: () => {
        this.notification.showSuccess('Contraseña actualizada correctamente');
        this.resetPasswordFields();
        this.showPasswordForm = false;
      },
      error: (err: AppError) => {
        // El interceptor ya mostró el toast
        if (err.fieldErrors) {
          this.fieldErrors = this.normalizeFieldErrors(err.fieldErrors);
        }
        this.serverError = err.userMessage ?? 'No pudimos cambiar la contraseña.';
      }
    });
  }

  // ============ UTILIDADES ============
  trimField(field: keyof Pick<UpdateUser, 'name' | 'lastname' | 'username'>): void {
    this[field] = this[field].trim();
  }

  togglePasswordForm(): void {
    this.showPasswordForm = !this.showPasswordForm;
    this.clearState();
    if (!this.showPasswordForm) {
      this.resetPasswordFields();
    }
  }

  // ============ PRIVADOS ============
  private clearState(): void {
    this.serverError = '';
    this.fieldErrors = {};
  }

  private resetPasswordFields(): void {
    this.currentPassword  = '';
    this.newPassword      = '';
    this.confirmNewPassword = '';
  }

  private normalizeFieldErrors(
    details: Record<string, string | string[]>
  ): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [field, messages] of Object.entries(details)) {
      const key   = this.mapFieldName(field);
      result[key] = Array.isArray(messages) ? messages.join(', ') : messages;
    }
    return result;
  }

  private mapFieldName(field: string): string {
    const fieldMap: Record<string, string> = {
      name:            'name',
      lastname:        'lastname',
      username:        'username',
      currentPassword: 'currentPassword',
      newPassword:     'newPassword',
    };
    return fieldMap[field] ?? field;
  }
}