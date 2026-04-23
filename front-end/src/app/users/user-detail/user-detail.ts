import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User, UserError } from '../../services/user';

@Component({
  selector: 'app-user-detail',
  standalone: false,
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css',
})
export class UserDetail implements OnInit {

  user: User | null = null;

  loading = true;
  serverError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/dashboard/users']);
      return;
    }

    // Reutilizamos getUsers porque tu service aún no tiene getUserById
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.user = users.find(u => u.id === id) || null;
        this.loading = false;

        if (!this.user) {
          this.serverError = 'Usuario no encontrado';
        }
      },
      error: (err: UserError) => {
        this.loading = false;
        this.serverError = err.userMessage;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/users']);
  }
}