import { Component, signal } from '@angular/core';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front-end');

  constructor(private authService: AuthService) {}

  ngOnInit(): void {

    this.authService.refresh().subscribe({
      next: () => console.log('Sesión restaurada'),
      error: () => console.log('No hay sesión activa')
    });

  }
}
