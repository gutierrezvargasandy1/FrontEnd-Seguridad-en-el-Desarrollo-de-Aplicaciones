// app/services/notification.service.ts
import { Injectable } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id:      number;
  message: string;
  type:    NotificationType;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {

  notifications: Notification[] = [];
  private nextId = 0;
  private readonly DURATION_MS = 3500;

  showSuccess(message: string): void { this.show(message, 'success'); }
  showError(message: string):   void { this.show(message, 'error');   }
  showWarning(message: string): void { this.show(message, 'warning'); }
  showInfo(message: string):    void { this.show(message, 'info');    }

  remove(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  private show(message: string, type: NotificationType): void {
    const id = this.nextId++;

    this.notifications.push({ id, message, type });

    // Auto-cierre no bloqueante — no congela el hilo como alert()
    setTimeout(() => this.remove(id), this.DURATION_MS);
  }
}