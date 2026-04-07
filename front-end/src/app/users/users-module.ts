import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateUser } from './update-user/update-user';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ListaUser } from './lista/lista';
import { CreateUser } from './create-user/create-user';
import { DetailUser } from './detail-user/detail-user';
import { EditUser } from './edit-user/edit-user';



@NgModule({
  declarations: [
    UpdateUser,
    ListaUser,
    CreateUser,
    DetailUser,
    EditUser
  ],
  imports: [
    CommonModule,
     RouterModule,  
    FormsModule
  ]
})
export class UsersModule { }
