import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import {
  HttpReqProvider
} from '../../providers/http-req/http-req';
import {
  AuthSingletonProvider
} from '../../providers/auth-singleton/auth-singleton';
import {
  DecimalPipe
} from '@angular/common';
import { DatePipe } from '@angular/common';
import {
  OrderBy
} from '../../pipes/sortgrid4/sortgrid4';
/**
 * Generated class for the HistoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
  authInfo: any;
  trnInfo: any;


statushist: any="0";

  statusTrn = (x) => {
    if (x == '0') {
      return 'On Process'
    } else {
      return 'Finished'
    }
  }

  trnNo = (x) => {
    if (x.substring(0, 3) == 'STR') {
      return 'Setor Tunai : '
    } else {
      return 'Tarik Tunai : '
    }
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public httpreq: HttpReqProvider, public auth: AuthSingletonProvider, ) {
    this.authInfo = this.auth.authInfo;
  }

  ionViewWillEnter() {
    this.showQr();
  }

  valueQr = (x) => {
    let y = {
      trnnumber: x,
      accountno: this.authInfo.accountno
    }

    return JSON.stringify(y)
  }

  showQr() {

    var params = {
      xaccountnumber: this.authInfo.accountno,
      xtoken: this.authInfo.token,
      xlocation: this.authInfo.longlat,
      xaction: 'history',
      xtrnnumber: '',
      xaccountnumberagen: '',
      xdate: '',
      xtime: '',
      xusername: this.authInfo.username
    }

    var query = "";
    for (let key in params) {
      query += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
    }

    this.httpreq.postreq("setrnnasabah?", query)
      .subscribe((response) => {
          console.log(response)
          this.trnInfo = response.NASABAH;
        }, (error) => {

        }

      )

  }

}
