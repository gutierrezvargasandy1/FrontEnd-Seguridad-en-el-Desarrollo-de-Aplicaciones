// app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../services/auth.service/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      console.log('AuthGuard: Usuario autenticado, acceso permitido');
      return true;
    }
    
    console.log('AuthGuard: Usuario no autenticado, redirigiendo a login');
    this.router.navigate(['/login']);
    return false;
  }
}