import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let userMessage = 'Ocurrió un error inesperado. Intente más tarde.';
        let originalError = error;

        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente (red, CORS, etc.)
          userMessage = 'Problema de conexión. Verifique su red.';
        } else {
          // El servidor respondió con un código HTTP
          switch (error.status) {
            case 0:
              userMessage = 'No se pudo conectar con el servidor.';
              break;
            case 400:
              // Intentar extraer mensaje amigable del cuerpo (si es JSON)
              userMessage = this.extractSafeMessageFromBody(error.error) || 'Solicitud incorrecta.';
              break;
            case 401:
              userMessage = 'Credenciales incorrectas o sesión expirada.';
              break;
            case 403:
              userMessage = 'No tiene permiso para realizar esta acción.';
              break;
            case 404:
              userMessage = 'Recurso no encontrado.';
              break;
            case 422:
              userMessage = this.extractSafeMessageFromBody(error.error) || 'Datos inválidos.';
              break;
            case 500:
              userMessage = 'Error interno del servidor. Estamos trabajando en ello.';
              break;
            default:
              userMessage = `Error del servidor (código ${error.status}).`;
          }
        }

        const normalizedError = {
          status: error.status,
          userMessage: userMessage,
          originalError: error   
        };

        return throwError(() => normalizedError);
      })
    );
  }

private extractSafeMessageFromBody(body: any): string | null {
  if (!body) return null;
  try {
    const parsed = typeof body === 'string' ? JSON.parse(body) : body;
    
    // Si el mensaje es un array, tomar el primero
    if (Array.isArray(parsed?.message) && parsed.message.length > 0) {
      return parsed.message[0].replace(/<[^>]*>/g, '').slice(0, 200);
    }
    
    const msg = parsed?.message || parsed?.error?.message;
    if (typeof msg === 'string') {
      return msg.replace(/<[^>]*>/g, '').slice(0, 200);
    }
  } catch (e) {}
  return null;
}
}