import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthSingletonProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthSingletonProvider {

  public authInfo: {
    username: string,
    token: string,
    longlat: string,
    accountno: string,
    saldo: number,
    agenmode: boolean,
    lat: string,
    lng: string
  }={
    username: '',
    token: '',
    longlat: '',
    accountno: '',
    saldo: 0,
    agenmode:false,
    lat:'',
    lng:''
  }

  constructor(public http: Http) {
  }

setter(username:string,token:string,longlat:string,accountno:string,lat?,lng?){
    this.authInfo.username= username;
    this.authInfo.token= token;
    this.authInfo.longlat= longlat;
    this.authInfo.accountno= accountno;
    this.authInfo.lat=lat;
    this.authInfo.lng=lng;
}

setloc(longlat){
  this.authInfo.longlat=longlat;
}

getter(){
  let a =this.authInfo;
  return a;
}


}
