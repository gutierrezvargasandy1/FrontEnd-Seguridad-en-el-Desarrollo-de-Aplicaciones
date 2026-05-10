import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';

import { Auth } from '../services/auth.service/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    // 1. Verificar autenticación
    if (!this.authService.isAuthenticated()) {

      console.log('AuthGuard - Usuario no autenticado');

      this.router.navigate(['/login']);
      return false;
    }

    // 2. Obtener roles permitidos de la ruta
    const allowedRoles = route.data['roles'] as ('ADMIN' | 'CLIENT')[] | undefined;

    // Si la ruta no requiere roles, permitir acceso
    if (!allowedRoles || allowedRoles.length === 0) {

      console.log('AuthGuard - Ruta protegida sin roles específicos');

      return true;
    }

    // 3. Obtener rol del usuario
    const userRole = this.authService.getUserRole();

    console.log('AuthGuard - Rol usuario:', userRole);
    console.log('AuthGuard - Roles permitidos:', allowedRoles);

    // 4. Validar rol
    if (userRole && allowedRoles.includes(userRole)) {

      console.log('AuthGuard - Acceso permitido');

      return true;
    }

    // 5. Acceso denegado
    console.log('AuthGuard - Acceso denegado');

    // Redirección según rol
    if (userRole === 'ADMIN') {
      this.router.navigate(['/dashboard/users']);
    }
    else if (userRole === 'CLIENT') {
      this.router.navigate(['/dashboard/tasks']);
    }
    else {
      this.router.navigate(['/login']);
    }

    return false;
  }
}