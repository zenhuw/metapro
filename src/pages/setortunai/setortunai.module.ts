import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetortunaiPage } from './setortunai';
import { AgmCoreModule} from '@agm/core';
import {GoogleMapsAPIWrapper} from '@agm/core'

@NgModule({
  declarations: [
    SetortunaiPage,
  ],
  imports: [
    IonicPageModule.forChild(SetortunaiPage),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDfbk4cvPuRXj7iSEWPAPYEZtc-DUdlo-s'
    })
  ],
  providers:[GoogleMapsAPIWrapper]
})
export class SetortunaiPageModule {}
