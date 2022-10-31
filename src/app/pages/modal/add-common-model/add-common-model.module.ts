import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddCommonModelPage } from './add-common-model.page';
import { SharedModule } from '../../../shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
const routes: Routes = [
  {
    path: '',
    component: AddCommonModelPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddCommonModelPage]
})
export class AddCommonModelPageModule {}
