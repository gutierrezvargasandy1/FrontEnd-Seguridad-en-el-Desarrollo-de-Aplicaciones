import { Component, signal } from '@angular/core';
import { Auth } from './services/auth.service/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front-end');

  constructor(private authService: Auth) {}

  ngOnInit(): void {



  }
}
