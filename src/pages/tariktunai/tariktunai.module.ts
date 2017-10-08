import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TariktunaiPage } from './tariktunai';
import {GoogleMapsAPIWrapper} from '@agm/core';
import { AgmCoreModule} from '@agm/core';
@NgModule({
  declarations: [
    TariktunaiPage,
  ],
  imports: [
    IonicPageModule.forChild(TariktunaiPage),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDfbk4cvPuRXj7iSEWPAPYEZtc-DUdlo-s'
    })
  ],
  providers:[GoogleMapsAPIWrapper]
})
export class TariktunaiPageModule {}
