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
  error: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.loading = true;
    this.error = null;

    // ⚠️ Asegúrate de tener este endpoint en tu backend
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar usuarios';
        this.loading = false;
      }
    });
  }

  deleteUser(id: number) {
    if (!confirm('¿Eliminar este usuario?')) return;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        // refresca la lista
        this.users = this.users.filter(u => u.id !== id);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al eliminar usuario';
      }
    });
  }
}
