// app/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Auth } from '../services/auth.service/auth';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as ('ADMIN' | 'CLIENT')[];
    const userRole = this.authService.getUserRole();
    
    console.log('RoleGuard - Usuario rol:', userRole);
    console.log('RoleGuard - Roles permitidos:', allowedRoles);
    
    if (!this.authService.isAuthenticated()) {
      console.log('RoleGuard - No autenticado, redirigiendo a login');
      this.router.navigate(['/login']);
      return false;
    }
    
    if (allowedRoles && userRole && allowedRoles.includes(userRole)) {
      console.log('RoleGuard - Acceso permitido');
      return true;
    }
    
    console.log('RoleGuard - Acceso denegado, redirigiendo');
    
    // Redirigir según el rol que tiene
    if (userRole === 'ADMIN') {
      this.router.navigate(['/dashboard/users']);
    } else if (userRole === 'CLIENT') {
      this.router.navigate(['/dashboard/tasks']);
    } else {
      this.router.navigate(['/login']);
    }
    return false;
  }
}