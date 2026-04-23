import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ListaUser } from './lista/lista';
import { CreateUser } from './create-user/create-user';
import { UserDetail } from './user-detail/user-detail';
import { UserUpdate } from './user-update/user-update';



@NgModule({
  declarations: [
    ListaUser,
    CreateUser,
    UserDetail,
    UserUpdate
  ],
  imports: [
    CommonModule,
     RouterModule,  
    FormsModule
  ]
})
export class UsersModule { }
