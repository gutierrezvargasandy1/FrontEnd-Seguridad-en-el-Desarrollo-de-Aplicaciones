import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService, User } from '../../services/user';

@Component({
  selector: 'app-edit-user',
  standalone: false,
  templateUrl: './edit-user.html',
  styleUrls: ['./edit-user.css'],
})
export class EditUser implements OnInit {

  user: User | null = null;

  loading: boolean = false;
  error: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  private extractError(err: any): string {
    let body = err.error;

    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return body; }
    }

    const msg = body?.message;
    return Array.isArray(msg) ? msg[0] : msg || body?.error || String(err.status);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error = 'ID inválido';
      return;
    }

    this.loading = true;

    this.userService.getUserById(id).subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = this.extractError(err);
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
      next: (res: any) => {
        this.successMessage = res?.message || 'Actualizado';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard/users']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = this.extractError(err);
        this.loading = false;
      }
    });
  }
}