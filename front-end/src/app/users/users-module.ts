import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateUser } from './update-user/update-user';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    UpdateUser
  ],
  imports: [
    CommonModule,
     RouterModule,  
    FormsModule
  ]
})
export class UsersModule { }
