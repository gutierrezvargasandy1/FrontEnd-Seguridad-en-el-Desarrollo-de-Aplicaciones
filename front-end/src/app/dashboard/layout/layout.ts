import { Component, ViewEncapsulation } from '@angular/core';
import { Auth } from '../../services/auth.service/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
  encapsulation: ViewEncapsulation.None  // ← Esto hace que los estilos sean globales

})
export class Layout {

  navOpen = false;

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  toggleNav() {
    this.navOpen = !this.navOpen;
  }

  closeNav() {
    this.navOpen = false;
  }

  logout() {
    this.navOpen = false;
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isClient(): boolean {
    return this.authService.isClient();
  }
}