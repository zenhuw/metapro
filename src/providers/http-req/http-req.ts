import {
  Injectable
} from '@angular/core';
import {
  Http,
  Headers,
  RequestOptions
} from '@angular/http';
import 'rxjs/add/operator/map';
import {
  Observable
} from 'rxjs/Rx'


/*
  Generated class for the HttpReqProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class HttpReqProvider {
  baseurl: string = 'http://103.200.7.141/semetapro/api/'
  constructor(public http: Http) {}

  getreq(url: string) {
    let obs = this.http.get(this.baseurl + url).map(res => res.json())
    return obs;
  };

  postreq(url: string, body) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({
      headers: headers
    });
    let obs = this.http.post(this.baseurl + url, body,options).map(res => res.json())
    return obs;
  };
}