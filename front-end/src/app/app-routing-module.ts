import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Profile } from './auth/profile/profile';
import { UpdateUser } from './auth/update-user/update-user';
import { Layout } from './dashboard/layout/layout';
import { List } from './tasks/list/list';
import { AgregarTarea } from './tasks/agregar-tarea/agregar-tarea';
import { TareaDetails } from './tasks/tarea-details/tarea-details';
import { UpdateTask } from './tasks/update-task/update-task';
import { ListaUser } from './users/lista/lista';
import { CreateUser } from './users/create-user/create-user';
import { UserDetail } from './users/user-detail/user-detail';
import { UserUpdate } from './users/user-update/user-update';
import { Lista } from './auditLog/lista/lista';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [

  // ================= AUTH =================
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },

  // ================= DASHBOARD =================
  {
    path: 'dashboard',
    component: Layout,
    canActivate: [AuthGuard],

    children: [

      // =====================================================
      // RUTAS PARA CLIENT Y ADMIN
      // =====================================================

      {
        path: 'tasks',
        component: List,
        data: {
          roles: ['CLIENT', 'ADMIN']
        }
      },

      {
        path: 'tasks/nueva',
        component: AgregarTarea,
        data: {
          roles: ['CLIENT', 'ADMIN']
        }
      },

      {
        path: 'tasks/:id',
        component: TareaDetails,
        data: {
          roles: ['CLIENT', 'ADMIN']
        }
      },

      {
        path: 'tasks/edit/:id',
        component: UpdateTask,
        data: {
          roles: ['CLIENT', 'ADMIN']
        }
      },

      {
        path: 'profile',
        component: Profile,
        data: {
          roles: ['CLIENT', 'ADMIN']
        }
      },

      {
        path: 'profile/update',
        component: UpdateUser,
        data: {
          roles: ['CLIENT', 'ADMIN']
        }
      },

      {
        path: 'audit-log',
        component: Lista,
        data: {
          roles: ['CLIENT', 'ADMIN']
        }
      },

      // =====================================================
      // RUTAS SOLO ADMIN
      // =====================================================

      {
        path: 'users',
        component: ListaUser,
        data: {
          roles: ['ADMIN']
        }
      },

      {
        path: 'users/create',
        component: CreateUser,
        data: {
          roles: ['ADMIN']
        }
      },

      {
        path: 'users/:id',
        component: UserDetail,
        data: {
          roles: ['ADMIN']
        }
      },

      {
        path: 'users/update/:id',
        component: UserUpdate,
        data: {
          roles: ['ADMIN']
        }
      },

      // ================= REDIRECCIÓN INTERNA =================
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full'
      }
    ]
  },

  // ================= REDIRECCIONES GLOBALES =================
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }