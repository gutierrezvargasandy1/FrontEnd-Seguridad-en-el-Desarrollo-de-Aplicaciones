import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { List } from './list/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AgregarTarea } from './agregar-tarea/agregar-tarea';
import { TareaDetails } from './tarea-details/tarea-details';
import { UpdateTask } from './update-task/update-task';



@NgModule({
  declarations: [
    List,
    AgregarTarea,
    TareaDetails,
    UpdateTask
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule

  ]
})
export class TasksModule { }
