import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User, UserError } from '../../services/user';

@Component({
  selector: 'app-detail-user',
  standalone: false,
  templateUrl: './detail-user.html',
  styleUrls: ['./detail-user.css']
})
export class DetailUser implements OnInit {
  user: User | null = null;
  loading = false;
  serverError = '';
  fieldErrors: { [key: string]: string } = {}; 

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || isNaN(id)) {
      this.serverError = 'ID de usuario inválido.';
      return;
    }
    this.getUser(id);
  }

  getUser(id: number): void {
    this.loading = true;
    this.serverError = '';

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

  deleteUser(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    this.loading = true;
    this.serverError = '';

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard/users']);
      },
      error: (err: UserError) => {
        this.serverError = err.userMessage;
        this.loading = false;
      }
    });
  }
}