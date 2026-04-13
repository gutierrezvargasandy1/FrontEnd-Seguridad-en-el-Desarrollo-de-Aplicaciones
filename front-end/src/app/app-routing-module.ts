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

const routes: Routes = [
  {path: 'login',component: Login},
  {path: 'register', component: Register},
  {
    path: 'dashboard',
    component: Layout,
    children: [
      { path: 'tasks', component: List },
      { path: 'tasks/nueva', component: AgregarTarea },
      { path: 'tasks/:id', component: TareaDetails },
      { path: 'profile', component: Profile },
      { path: 'users', component: ListaUser },
      { path: 'users/create', component: CreateUser },
      { path: 'tasks/edit/:id', component: UpdateTask},

    ]
},

  { path: '', redirectTo: 'login', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
