import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService, User, UserError } from '../../services/user';

@Component({
  selector: 'app-edit-user',
  standalone: false,
  templateUrl: './edit-user.html',
  styleUrls: ['./edit-user.css']
})
export class EditUser implements OnInit {
  user: User | null = null;
  loading = false;
  serverError = '';
  successMessage = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || isNaN(id)) {
      this.serverError = 'ID de usuario inválido.';
      return;
    }

    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (err: UserError) => {
        this.serverError = err.userMessage;
        this.loading = false;
      }
    });
  }

  updateUser(form: NgForm): void {
    // Resetear mensajes previos
    this.serverError = '';
    this.fieldErrors = {};
    this.successMessage = '';

    if (form.invalid || !this.user) {
      form.control.markAllAsTouched();
      return;
    }

    this.loading = true;

    const dto = {
      name: this.user.name,
      lastname: this.user.lastname,
      username: this.user.username
    };

    this.userService.updateUserById(this.user.id, dto).subscribe({
      next: () => {
        this.successMessage = 'Usuario actualizado correctamente';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard/users']);
        }, 1500);
      },
      error: (err: UserError) => {
        this.loading = false;
        if (err.fieldErrors) {
          this.fieldErrors = err.fieldErrors;
        } else {
          this.serverError = err.userMessage;
        }
      }
    });
  }
}