import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  MenuController,
  LoadingController,
  AlertController,
  ModalController

} from 'ionic-angular';
import {
  TabsPage
} from '../tabs/tabs'
import {
  HttpReqProvider
} from '../../providers/http-req/http-req';
import {
  AuthSingletonProvider
} from '../../providers/auth-singleton/auth-singleton';
import {RegistrationPage}
from '../registration/registration'
import { Geolocation } from '@ionic-native/geolocation';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  userInfo: {
    username: string,
    password: string,
    longlat: string,
  } = {
    username: '',
    password: '',
    longlat: ''

  }
  alert: any;
  loading: any;

  longlat: any;
  lat:string;
  lng:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public menucontroller: MenuController, public loadingCtrl: LoadingController, public httpreq: HttpReqProvider, public auth: AuthSingletonProvider, public alertctrl: AlertController,public modalCtrl:ModalController,private geolocation: Geolocation) {
    this.menucontroller.enable(false, 'myMenu');

    this.getLocation();
  }
  ionViewDidEnter() {
    this.menucontroller.close();
    this.menucontroller.swipeEnable(false, 'myMenu');
  }

  goLogin() {
    console.log(this.longlat)
    
    this.showloading();
    this.loading.present();
    this.httpreq.postreq("selogin?","xusername="+this.userInfo.username +"&xpassword=" + this.userInfo.password + "&xlocation=" + this.longlat + "&xloginfrom=M")
      .subscribe((response) => {
          console.log(response)
          if (response.STATUS == "OK") {
            this.auth.setter(this.userInfo.username, response.TOKEN, this.longlat, response.ACCOUNT,this.lat,this.lng)
            this.loading.dismiss();
            this.navCtrl.push(TabsPage);
            console.log(this.auth.authInfo);
          } else {
            this.loading.dismiss();
            this.showalert(response.MESSAGE);
          }

        }, (error) => {
          this.loading.dismiss();
          this.showalert("KONEKSI BERMASALAH, HARAP ULANGI BEBERAPA SAAT LAGI");
        }

      )
  }


getLocation(){
  this.geolocation.getCurrentPosition().then((resp) => {
    this.longlat = resp.coords.longitude.toString() + ' ' + resp.coords.latitude.toString();
    this.lat= resp.coords.latitude.toString();
    this.lng= resp.coords.longitude.toString();
    // resp.coords.latitude
    // resp.coords.longitude
   }).catch((error) => {
     console.log('Error getting location', error);
   });
}

  // getLocation() {
  //   var lat;
  //   var lot;
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(this.run);
  //   } else {}
  // }

  run = (position) => {
    var lat = position.coords.latitude;
    var lot = position.coords.longitude;
    this.longlat = lot + ' ' + lat;
    this.lat=lat;
    this.lng=lot;


  }


  showalert(msg) {
    let alert = this.alertctrl.create({
      title: 'NOTIFICATION',
      subTitle: msg,
      buttons: ['Ok']
    });

    alert.present();

  }

  showloading(msg ? ) {
    this.loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please Wait...'
    });
  }

  openModal() {
    let myModal = this.modalCtrl.create(RegistrationPage,{loginpage:true});
    myModal.present();
  }






}
