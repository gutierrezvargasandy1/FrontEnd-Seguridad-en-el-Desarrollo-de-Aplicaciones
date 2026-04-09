import { Component, OnInit } from '@angular/core';
import { AuthService, User, LoginError } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  user: User | null = null;
  loading = true;
  serverError = '';
  fieldErrors: { [key: string]: string } = {}; // Por consistencia, aunque no se use aquí

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.serverError = '';

    this.authService.me().subscribe({
      next: (user) => {
        if (!user || !user.username) {
          this.serverError = 'Datos del perfil incompletos.';
          this.loading = false;
          return;
        }
        this.user = user;
        this.loading = false;
      },
      error: (err: LoginError) => {
        this.serverError = err.userMessage;
        this.loading = false;
      }
    });
  }
}