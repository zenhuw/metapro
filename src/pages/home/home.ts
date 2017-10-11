import {
  Component
} from '@angular/core';
import {
  NavController,
  AlertController,
  LoadingController,
  ModalController
} from 'ionic-angular';
import {
  DecimalPipe
} from '@angular/common';
import {
  HttpReqProvider
} from '../../providers/http-req/http-req';
import {
  AuthSingletonProvider
} from '../../providers/auth-singleton/auth-singleton';
import {
  BarcodeScanner,
  BarcodeScannerOptions
} from '@ionic-native/barcode-scanner';
import moment from 'moment';

import {SaldomodalPage
} from '../saldomodal/saldomodal';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  authInfo: any;
  loading: any;
  pin: string;
  options: BarcodeScannerOptions;
  results: any;


agenCheck(){
  if(this.auth.authInfo.agenmode==false){
    this.showalert("Aktifkan Mode Agen di Menu Setting", "Notification")
  }else if(this.auth.authInfo.agenmode==true){
    this.showPrompt('scan');
  }
}

  async scanBarcode() {
    this.results = null
    this.results = await this.barcode.scan();
    if (this.results !== null) {
      this.QRscan();
    }
  }
  scanSync() {
    this.barcode.scan().then((barcodeData) => {
      this.results = null
      this.results = barcodeData;
      if (barcodeData.text.length >0) {
        this.QRscan();
      }
      console.log(typeof this.results);
    }, (err) => {
      console.log(err)
    });
  }
  showloading(msg ? ) {
    this.loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please Wait...'
    });
  }
  getCurrency(amount: any) {
    return this.decimalPipe.transform(amount, '3.2-5');
  }
  showalert(msg, title) {
    let alert = this.alertctrl.create({
      title: title,
      subTitle:msg,
      buttons: [{
        text: 'Ok',
        role: 'ok',
        handler: () => {}
      }]
    });


    alert.present();

  }


  
  showPrompt(tran) {
    let prompt = this.alertctrl.create({
      title: 'PIN',
      message: "Enter Your PIN",
      inputs: [{
        name: 'PIN',
        placeholder: '123456',
        type: 'password',
        max: 6,
        min: 6
      }, ],
      buttons: [{
          text: 'Confirm',
          handler: data => {
            this.pin = data.PIN;
            this.saldoModal(tran);
          }
        },
        {
          text: 'Cancel',
          handler: data => {}
        }

      ]
    });
    prompt.present();
  }
  constructor(public navCtrl: NavController, public alertctrl: AlertController, private decimalPipe: DecimalPipe, public httpreq: HttpReqProvider, public auth: AuthSingletonProvider, public loadingCtrl: LoadingController, private barcode: BarcodeScanner, public modalCtrl: ModalController) {
    this.authInfo = this.auth.authInfo;
  }

  gotoPage(page) {
    this.navCtrl.push(page);
  }

  QRscan() {
    let date = moment().format('YYYY:MM:DD');
    let time = moment().format('HH:mm:ss');

    var params = {
      xaccountnumber: this.results.text.accountno,
      xtoken: this.authInfo.token,
      xlocation: this.authInfo.longlat,
      xaction: 'trnagen',
      xtrnnumber: this.results.text.trnnumber,
      xaccountnumberagen: this.authInfo.accountno,
      xdate: date,
      xtime: time,
      xusername: this.authInfo.username
    }

    var query = "";
    for (let key in params) {
      query += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
    }
    this.showloading();
    this.loading.present();
    this.httpreq.postreq("setrnnasabah?", query)
      .subscribe((response) => {
          console.log(response);
          if (response.STATUS == "OK") {
            this.loading.dismiss();
            this.showalert(response.MESSAGE, 'Notification');


          } else if (response.STATUS != "OK") {
            this.loading.dismiss();
            this.showalert(response.MESSAGE, 'Notification');
            console.log(response)
          }
        }, (error) => {
          this.loading.dismiss();

          this.showalert("KONEKSI BERMASALAH, HARAP ULANGI BEBERAPA SAAT LAGI", 'Notification');
        }

      )
  }


  saldoCheck() {
    var params = {
      xaccountnumber: this.authInfo.accountno,
      xpin: this.pin,
      xtoken: this.authInfo.token,
      xlocation: this.authInfo.longlat,
      xusername: this.authInfo.username

    }


    var query = "";
    for (let key in params) {
      query += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
    }
    this.showloading();
    this.loading.present();
    this.httpreq.getreq("sechecksaldo?" + query)
      .subscribe((response) => {
          console.log(response)
          if (response.STATUS == "OK") {
            this.loading.dismiss();
            console.log(response.MESSAGE)
            let title = response.MESSAGE
            let saldo = response.SALDO
            console.log(saldo.length);
            if (saldo.length > 0) {
              let saldodec = this.getCurrency(saldo)
              this.showalert(saldodec, title); // the array is defined and has at least one element
            } else {
              this.showalert('0.00', title);
            }

          } else if (response.STATUS != "OK") {
            this.loading.dismiss();
            //  this.showalert(response.MESSAGE);
            console.log(response)
          }

        }, (error) => {
          this.loading.dismiss();

          this.showalert("KONEKSI BERMASALAH, HARAP ULANGI BEBERAPA SAAT LAGI", 'Notification');
        }

      )

  }

  
  saldoModal(tran) {
    var params = {
      xaccountnumber: this.authInfo.accountno,
      xpin: this.pin,
      xtoken: this.authInfo.token,
      xusername: this.authInfo.username,
      xaction:"rekening"
    }


    var query = "";
    for (let key in params) {
      query += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
    }
    this.showloading();
    this.loading.present();
    this.httpreq.postreq("serekening?" , query)
      .subscribe((response) => {
          console.log(response)
          
          if (response.STATUS == "OK") {
            this.loading.dismiss();
            
            tran=="saldo"?this.openModal(response):this.scanSync();

          } else if (response.STATUS != "OK") {
            this.loading.dismiss();
            this.showalert(response.DATA,"Notification");
            console.log(response)
          }

        }, (error) => {
          this.loading.dismiss();

          this.showalert("KONEKSI BERMASALAH, HARAP ULANGI BEBERAPA SAAT LAGI", 'Notification');
        }

      )

  }

  openModal(obj) {
    let myModal = this.modalCtrl.create(SaldomodalPage,obj);
    myModal.present();
  }

}

// Irwan Iglo, [20.08.17 14:13]
// sechecksaldo

// Irwan Iglo, [20.08.17 14:14]
// prametter xaccountnumber,xpin,xusername,xtoken,xlocation
