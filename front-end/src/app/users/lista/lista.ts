import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../services/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista',
  standalone: false,
  templateUrl: './lista.html',
  styleUrls: ['./lista.css'],
})
export class ListaUser implements OnInit {

  users: User[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  private extractError(err: any): string {
    try {
      const body = typeof err.error === 'string' ? JSON.parse(err.error) : err.error;
      const msg = body?.message;
      if (Array.isArray(msg)) return msg[0];
      if (typeof msg === 'string') return msg;
      if (typeof body === 'string') return body;
      return String(err.status || 'Error');
    } catch {
      return String(err.status || 'Error');
    }
  }

  getUsers(): void {
    this.loading = true;
    this.error = '';

    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res || [];
        this.loading = false;
        if (this.users.length === 0) {
          this.error = 'No hay usuarios registrados.';
        }
      },
      error: (err) => {
        this.error = this.extractError(err);
        this.loading = false;
      }
    });
  }

  deleteUser(id: number): void {
    if (!confirm('¿Eliminar este usuario?')) return;

    this.loading = true;
    this.error = '';

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
        this.loading = false;
        if (this.users.length === 0) {
          this.error = 'No hay usuarios registrados.';
        }
      },
      error: (err) => {
        this.error = this.extractError(err);
        this.loading = false;
      }
    });
  }
}