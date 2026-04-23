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
    const confirmDelete = confirm('¿Seguro que deseas eliminar este usuario?');
    if (!confirmDelete) return;

    this.loading = true;

    // 🔥 cuando agregues deleteUser al service solo cambia esta línea
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.getUsers(); // refresca lista
      },
      error: (err: UserError) => {
        this.serverError = err.userMessage;
        this.loading = false;
      }
    });
  }
}