import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service/user';
import { User } from '../../services/user.service/interface/user.interface';
import { ErrorResponse } from '../../services/error-response.interface';

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
      error: (err: ErrorResponse) => {
        this.serverError = err.userMessage;
        this.loading = false;
      }
    });
  }

  deleteUser(id: number): void {
    const confirmDelete = confirm('¿Seguro que deseas eliminar este usuario?');
    if (!confirmDelete) return;

    this.loading = true;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.getUsers(); 
      },
      error: (err: ErrorResponse  ) => {
        this.serverError = err.userMessage;
        this.loading = false;
      }
    });
  }
}