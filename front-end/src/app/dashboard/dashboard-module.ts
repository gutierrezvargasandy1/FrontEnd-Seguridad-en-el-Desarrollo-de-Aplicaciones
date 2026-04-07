import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Layout } from './layout/layout';
import { RouterModule, RouterOutlet } from "@angular/router";



@NgModule({
  declarations: [
    Layout
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule
]
})
export class DashboardModule { }
