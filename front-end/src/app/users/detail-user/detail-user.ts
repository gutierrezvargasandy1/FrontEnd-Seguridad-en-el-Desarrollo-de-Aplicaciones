import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from '../../services/user';

@Component({
  selector: 'app-detail-user',
  standalone: false,
  templateUrl: './detail-user.html',
  styleUrls: ['./detail-user.css'],
})
export class DetailUser implements OnInit {

  user: User | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

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

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'ID inválido';
      return;
    }
    this.getUser(id);
  }

  getUser(id: number) {
    this.loading = true;
    this.error = null;

    this.userService.getUserById(id).subscribe({
      next: (res) => {
        this.user = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = this.extractError(err);
        this.loading = false;
      }
    });
  }

  deleteUser(id: number) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    this.loading = true;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard/users']);
      },
      error: (err) => {
        this.error = this.extractError(err);
        this.loading = false;
      }
    });
  }
}