import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: false,
  templateUrl: './notification.html',
  styleUrls: ['./notification.css'],
})
export class Notification {

  constructor(public notificationService: NotificationService) {}

  remove(id: number): void {
    this.notificationService.remove(id);
  }
}