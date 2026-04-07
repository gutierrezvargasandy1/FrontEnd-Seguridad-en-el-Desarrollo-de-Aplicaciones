import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from './login/login';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Profile } from './profile/profile';
import { RouterModule } from '@angular/router';
import { Register } from './register/register';



@NgModule({
  declarations: [
    Login,
    Profile,
    Register
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule
]
})
export class AuthModule { }
