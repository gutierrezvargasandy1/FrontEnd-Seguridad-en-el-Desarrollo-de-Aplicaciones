import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService, User } from '../../services/user';

@Component({
  selector: 'app-edit-user',
  standalone: false,
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css',
})
export class EditUser implements OnInit {

  user: User | null = null;
  loading = false;
  error = '';
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;

    this.userService.getUserById(id).subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el usuario.';
        this.loading = false;
      }
    });
  }

  updateUser(form: NgForm): void {
    if (form.invalid || !this.user) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const dto = {
      name: this.user.name,
      lastname: this.user.lastname,
      username: this.user.username,
    };

    this.userService.updateUserById(this.user.id, dto).subscribe({
      next: () => {
        this.successMessage = 'Usuario actualizado correctamente.';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/dashboard/users']), 1500);
      },
      error: () => {
        this.errorMessage = 'Error al actualizar el usuario.';
        this.loading = false;
      }
    });
  }
}