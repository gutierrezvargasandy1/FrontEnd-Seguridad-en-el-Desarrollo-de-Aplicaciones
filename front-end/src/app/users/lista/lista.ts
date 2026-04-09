import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User, UserError } from '../../services/user';

@Component({
  selector: 'app-lista',
  standalone: false,
  templateUrl: './lista.html',
  styleUrls: ['./lista.css']
})
export class ListaUser implements OnInit {
  users: User[] = [];
  loading = false;
  serverError = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.loading = true;
    this.serverError = '';

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err: UserError) => {
        this.serverError = err.userMessage;
        this.loading = false;
      }
    });
  }

  deleteUser(id: number): void {
    if (!confirm('¿Eliminar este usuario?')) return;

    this.loading = true;
    this.serverError = '';

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
        this.loading = false;
      },
      error: (err: UserError) => {
        this.serverError = err.userMessage;
        this.loading = false;
      }
    });
  }
}