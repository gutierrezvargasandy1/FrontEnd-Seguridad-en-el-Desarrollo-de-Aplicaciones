import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ListaUser } from './lista/lista';
import { CreateUser } from './create-user/create-user';



@NgModule({
  declarations: [
    ListaUser,
    CreateUser
  ],
  imports: [
    CommonModule,
     RouterModule,  
    FormsModule
  ]
})
export class UsersModule { }
