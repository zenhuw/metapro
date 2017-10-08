import { DecimalPipe } from '@angular/common';
import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  MenuController,
  LoadingController,
  AlertController
} from 'ionic-angular';
import {
  HttpReqProvider
} from '../../providers/http-req/http-req';
import {
  AuthSingletonProvider
} from '../../providers/auth-singleton/auth-singleton';
import {
  GoogleMapsAPIWrapper
} from '@agm/core'
declare var google: any
/**
 * Generated class for the SetortunaiPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tariktunai',
  templateUrl: 'tariktunai.html',
})
export class TariktunaiPage {
  lat: string = this.auth.authInfo.lat;
  lng: string = this.auth.authInfo.lng;
  text: string ='';
  infowindowOpen: boolean = true;

  input: {
    nominal: any,
   note: string,
   nominalstr: string,
   nominalstrold: string,
   pin: string
  }={
    nominal:'',
    nominalstr: '',
    nominalstrold:'',
    note: "",
    pin: ""
  }
  changeDetected: boolean=false;
  getCurrency(amount: any) {
    return this.decimalPipe.transform(amount,'1.2-2');
  }

    loading: any;
  showalertsucc(msg) {
    let alert = this.alertctrl.create({
      title: 'NOTIFICATION',
      subTitle: msg,
      buttons: [ {
        text: 'Ok',
        role: 'ok',
        handler: () => {
          this.navCtrl.pop();
        }
      }]
    });

    alert.present();

  }

showPrompt() {
    let prompt = this.alertctrl.create({
      title: 'PIN',
      message: "Enter Your PIN",
      inputs: [
        {
          name: 'PIN',
          placeholder: '123456',
          type: 'password',
          max:6,
          min:6
        },
      ],
      buttons: [
        {
          text: 'Confirm',
          handler: data => {
            this.input.pin= data.PIN;
            this.transactionStart();
          }
        },
        {
          text: 'Cancel',
          handler: data => {
          }
        }

      ]
    });
    prompt.present();
  }

  showalert(msg) {
    let alert = this.alertctrl.create({
      title: 'NOTIFICATION',
      subTitle: msg,
      buttons: [ {
        text: 'Ok',
        role: 'ok',
        handler: () => {
          this.navCtrl.pop();
        }
      }]
    });

    alert.present();

  }

  showloading(msg ? ) {
    this.loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please Wait...'
    });
  }

  authInfo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private decimalPipe: DecimalPipe,
   public loadingCtrl: LoadingController, public httpreq: HttpReqProvider, public auth: AuthSingletonProvider, public alertctrl: AlertController) {
     this.authInfo= this.auth.authInfo; }
  

  // jalanin() {
    
  //       if (this.input.nominalstr !== this.input.nominalstrold) {
  //         this.changeDetected = true;
  //         this.input.nominal = this.input.nominalstr.split(',').join('');
  //         this.input.nominalstr = this.getCurrency(this.input.nominal);
  //         console.log('tai'+this.input.nominalstr);
  //         this.input.nominalstrold = this.input.nominalstr
  //       }
  //       this.changeDetected = false;
  //     }
onChangePrice(evt) {
        this.input.nominal = evt.split(",").join(" ");
        this.input.nominal = this.input.nominal.split(".").join(" ");
        this.input.nominal = this.input.nominal.replace(" ", "");
        if (this.input.nominal != '') {
            this.input.nominalstr = this.getCurrency(this.input.nominal)
            console.log("box_price_formatted: " + this.input.nominal);
        }
    }
onPriceUp(evt){
  this.input.nominal = evt.split(",").join(" ");
  this.input.nominal = this.input.nominal.split(".").join(" ");
  this.input.nominal = this.input.nominal.replace(" ", "");
  this.input.nominalstr = this.input.nominal;
    }
    
    submitButton(){
      this.showPrompt();
      }

      
      transactionStart(){
        console.log(this.input.pin)
   var  params= {
           xaccountnumber:     this.authInfo.accountno,
                xpin: this.input.pin,
                xtoken: this.authInfo.token,
                xnominal: this.input.nominal,
                xlocation: this.authInfo.longlat,
                xketerangan: this.input.note,
      xusername: this.authInfo.username,
xtranfrom: 'M'
              }
              

    var query = "";
    for (let key in params) {
        query += encodeURIComponent(key)+"="+encodeURIComponent(params[key])+"&";
    }
        this.showloading();
        this.loading.present();
        this.httpreq.postreq("setariktunai?",query)
          .subscribe((response) => {
              if (response.STATUS == "OK") {
                this.loading.dismiss();
                console.log(response)
                this.showalertsucc(response.MESSAGE);
              
                
              } else if(response.STATUS !="OK") {
                this.loading.dismiss();
                this.showalert(response.MESSAGE);
                console.log(response)
              }
    
            }, (error) => {
              this.loading.dismiss();

              this.showalert("KONEKSI BERMASALAH, HARAP ULANGI BEBERAPA SAAT LAGI");
            }
    
          )
      }
      isnan(value) {
        if (isNaN(value)) {
          return true
        } else {
          return false
        }
      }

      updateinfoWindows(){
        var latlng = {
          lat: parseFloat(this.lat),
          lng: parseFloat(this.lng)
        };
            var geocoder = new google.maps.Geocoder;
            geocoder.geocode({
              'location': latlng
            }, ((results,status) =>{
                  this.infowindowOpen = true;
                  this.text = results[0].formatted_address;         
            })
            )
      }
      
      
      
        updatePos(evt) {
          this.lat = evt.lat;
          this.lng = evt.lng;
      
            }
      }

