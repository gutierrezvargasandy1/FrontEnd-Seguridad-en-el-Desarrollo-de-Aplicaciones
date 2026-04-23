import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Lista } from './lista/lista';

@NgModule({
  declarations: [
    Lista
  ],
  imports: [
    CommonModule,   
    FormsModule,    
    RouterModule
  ]
})
export class AuditModule { }