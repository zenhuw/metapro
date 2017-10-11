import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryPage } from './history';
import {OrderBy}
from '../../pipes/sortgrid4/sortgrid4';

@NgModule({
  declarations: [
    HistoryPage,OrderBy
  ],
  imports: [
    IonicPageModule.forChild(HistoryPage),
  ],
  providers:[OrderBy]
})
export class HistoryPageModule {}
