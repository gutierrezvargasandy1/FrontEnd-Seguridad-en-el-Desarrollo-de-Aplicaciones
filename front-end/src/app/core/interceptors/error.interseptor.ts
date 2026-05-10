import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpErrorResponse, HttpContextToken
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';


export const SKIP_ERROR_HANDLER = new HttpContextToken<boolean>(() => false);


export interface AppError {
  status: number;
  errorCode: string | null;
  userMessage: string;
  fieldErrors: Record<string, string | string[]> | null;
  originalError: HttpErrorResponse;
}


const ERROR_MESSAGES: Record<string, string> = {
  // AUTH
  'USER_NOT_FOUND': 'No encontramos una cuenta con este usuario. Verifica tus datos.',
  'INVALID_PASSWORD': 'Contraseña incorrecta. Inténtalo de nuevo.',
  'INVALID_CREDENTIALS': 'Usuario o contraseña incorrectos.',
  'UNAUTHORIZED': 'Debes iniciar sesión para acceder a esta sección.',
  'TOKEN_EXPIRED': 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  'INVALID_TOKEN': 'Tu sesión no es válida. Inicia sesión de nuevo.',
  'FORBIDDEN': 'No tienes permiso para realizar esta acción.',

  // USER
  'USER_ALREADY_EXISTS': 'Ya existe un usuario con estos datos. Prueba con otro correo.',
  'USER_NOT_FOUND_DB': 'No encontramos el usuario solicitado.',
  'USER_CREATE_FAILED': 'No pudimos crear tu cuenta. Inténtalo más tarde.',
  'USER_UPDATE_FAILED': 'No pudimos actualizar tus datos. Inténtalo de nuevo.',
  'USER_DELETE_FAILED': 'No pudimos eliminar tu cuenta. Contacta a soporte.',

  // TASK
  'TASK_NOT_FOUND': 'No encontramos la tarea que buscas.',
  'TASK_CREATE_FAILED': 'No pudimos crear la tarea. Inténtalo de nuevo.',
  'TASK_UPDATE_FAILED': 'No pudimos actualizar la tarea. Inténtalo de nuevo.',
  'TASK_DELETE_FAILED': 'No pudimos eliminar la tarea. Inténtalo de nuevo.',

  // AUDIT LOG
  'AUDITLOG_CREATE_FAILED': 'No pudimos registrar esta acción.',
  'AUDITLOG_NOT_FOUND': 'No encontramos el registro solicitado.',

  // VALIDATION
  'VALIDATION_ERROR': 'Por favor, revisa los campos del formulario.',

  // DATABASE
  'UNIQUE_CONSTRAINT': 'Este valor ya está en uso. Por favor, usa otro.',
  'FOREIGN_KEY_ERROR': 'No podemos realizar esta acción porque hay datos relacionados.',
  'DATABASE_ERROR': 'Error en la base de datos. Inténtalo más tarde.',

  // GENERAL
  'INTERNAL_ERROR': 'Error interno del servidor. Nuestro equipo ya está trabajando en ello.',
};


const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: 'Solicitud incorrecta. Verifica los datos enviados.',
  401: 'No autorizado. Inicia sesión para continuar.',
  403: 'No tienes permiso para acceder a este recurso.',
  404: 'No encontramos lo que buscas.',
  409: 'Conflicto: El recurso ya existe.',
  422: 'Error de validación. Revisa los campos del formulario.',
  429: 'Demasiadas solicitudes. Espera un momento.',
  500: 'Error en el servidor. Inténtalo más tarde.',
  503: 'Servicio no disponible. Intenta más tarde.',
};

// ============================================================
// INTERCEPTOR
// ============================================================
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((httpError: HttpErrorResponse) => {

        if (req.context.get(SKIP_ERROR_HANDLER)) {
          return throwError(() => httpError);
        }

        const backendBody = this.parseErrorBody(httpError.error);

        const errorCode = backendBody?.errorCode ?? null;
        const userMessage = this.translateError(httpError, backendBody);
        const fieldErrors = this.extractFieldErrors(backendBody);

        const isSilent401 =
          httpError.status === 401 &&
          (
            errorCode === 'UNAUTHORIZED' ||
            errorCode === 'INVALID_TOKEN' ||
            errorCode === 'TOKEN_EXPIRED'
          );


        if (!isSilent401) {

          const notificationService =
            this.injector.get(NotificationService);

          notificationService.showError(userMessage);
        }

        if (!isSilent401) {

          console.groupCollapsed(
            `[API Error] ${httpError.status} ${req.method} ${req.url}`
          );

          console.table({
            'HTTP Status': httpError.status,
            'Error Code': errorCode,
            'User Msg': userMessage,
            'Backend Msg': backendBody?.message ?? '—',
            'Body type': typeof httpError.error,
          });

          if (fieldErrors) {
            console.log('Field errors:', fieldErrors);
          }

          console.groupEnd();
        }

        // Objeto plano tipado — NO spread de HttpErrorResponse
        const appError: AppError = {
          status: httpError.status,
          errorCode,
          userMessage,
          fieldErrors,
          originalError: httpError,
        };

        return throwError(() => appError);
      })
    );
  }

  // ----------------------------------------------------------
  // Parseo defensivo del body
  // ----------------------------------------------------------
  private parseErrorBody(raw: any): any {
    if (raw === null || raw === undefined) return null;

    if (typeof raw === 'object') return raw;

    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw);
      } catch {
        return { message: raw, errorCode: null };
      }
    }

    return null;
  }


  private translateError(error: HttpErrorResponse, body: any): string {
    if (error.status === 0) {
      return 'No podemos conectar con el servidor. Verifica tu conexión a internet.';
    }

    const errorCode = body?.errorCode;

    // errorCode conocido → mensaje mapeado
    if (errorCode && ERROR_MESSAGES[errorCode]) {
      return ERROR_MESSAGES[errorCode];
    }

    // Mensaje directo del backend (si no es técnico)
    if (body?.message && typeof body.message === 'string') {
      if (!this.isTechnicalMessage(body.message)) {
        return body.message;
      }
    }

    // Error como string plano original
    if (typeof error.error === 'string') {
      return error.error;
    }

    return (
      HTTP_STATUS_MESSAGES[error.status] ??
      `Error ${error.status}: Ocurrió un problema inesperado.`
    );
  }


  private extractFieldErrors(
    body: any
  ): Record<string, string | string[]> | null {
    if (!body?.details || typeof body.details !== 'object') {
      return null;
    }

    const result: Record<string, string | string[]> = {};

    for (const [field, messages] of Object.entries(body.details)) {
      if (Array.isArray(messages)) {
        result[field] = messages.map(String);
      } else if (typeof messages === 'string') {
        result[field] = messages;
      }
    }

    return Object.keys(result).length > 0 ? result : null;
  }


  private isTechnicalMessage(message: string): boolean {
    const patterns = [
      /stack\s*trace/i,
      /at \w+\./i,
      /internal\s*server/i,
      /\bundefined\b/i,
      /null\s*reference/i,
      /database\s*query/i,
      /\bsql\b/i,
      /error\s*code:/i,
    ];
    return patterns.some(p => p.test(message));
  }


  private getFriendlyFieldName(field: string): string {
    const map: Record<string, string> = {
      username: 'Usuario',
      password: 'Contraseña',
      name: 'Nombre',
      lastname: 'Apellido',
      email: 'Correo electrónico',
      title: 'Título',
      description: 'Descripción',
      status: 'Estado',
      dueDate: 'Fecha de vencimiento',
    };
    return map[field] ?? field;
  }
}