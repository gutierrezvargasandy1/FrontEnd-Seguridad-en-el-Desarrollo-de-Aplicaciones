// app/app-routing-module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Layout } from './dashboard/layout/layout';
import { List } from './tasks/list/list';
import { AgregarTarea } from './tasks/agregar-tarea/agregar-tarea';
import { TareaDetails } from './tasks/tarea-details/tarea-details';
import { Profile } from './auth/profile/profile';
import { Register } from './auth/register/register';
import { UpdateTask } from './tasks/update-task/update-task';
import { CreateUser } from './users/create-user/create-user';
import { ListaUser } from './users/lista/lista';
import { UpdateUser } from './auth/update-user/update-user';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UserDetail } from './users/user-detail/user-detail';
import { UserUpdate } from './users/user-update/user-update';
import { Lista } from './auditLog/lista/lista';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'dashboard',
    component: Layout,
    canActivate: [AuthGuard], // Protección: solo usuarios autenticados
    children: [
      // ============ RUTAS PARA AMBOS ROLES (CLIENT y ADMIN) ============
      { path: 'tasks', component: List },
      { path: 'tasks/nueva', component: AgregarTarea },
      { path: 'tasks/:id', component: TareaDetails },
      { path: 'tasks/edit/:id', component: UpdateTask },
      { path: 'profile', component: Profile },
      { path: 'profile/update', component: UpdateUser },
      {
        path: 'audit-log',
        component: Lista,
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'CLIENT'] }
      },
      // ============ RUTAS SOLO PARA ADMIN ============
      {
        path: 'users',
        component: ListaUser,
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'users/create',
        component: CreateUser,
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'users/:id',
        component: UserDetail,
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'users/update/:id',
        component: UserUpdate,
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' } // Ruta comodín para páginas no encontradas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }