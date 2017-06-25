import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnDestroy
} from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { AuthService } from '../../services/index';
import { JWT_CHECK_TIMEOUT, JWT_KEY, APP_USER } from '../../constants';
import * as _ from 'lodash';

@Component({
  selector: 'main-container',
  styleUrls: [ `./main.component.scss` ],
  templateUrl: `./main.component.html`,
  encapsulation: ViewEncapsulation.None,
  providers: [ AuthService, JwtHelper ]
})
export class MainComponent implements OnInit, OnDestroy {

  private jwtKey: string = JWT_KEY;
  private jwtCheckInterval: any = setInterval(() => {
    this.checkJwtToken();
  }, JWT_CHECK_TIMEOUT);

  constructor(
    private jwtHelper: JwtHelper,
    private _auth: AuthService
  ) {}

  public ngOnInit() {
    if (!location.pathname || location.pathname.length < 2) {
      this._auth.signOut();
    }
    this.checkJwtToken();
  }

  public ngOnDestroy() {
    clearInterval(this.jwtCheckInterval);
  }

  /**
   * Check if JWT token expired of expires soon (see: JWT_CHECK_TIMEOUT)
   * and makes request with "refresh token" to update "auth token"
   */
  private checkJwtToken() {
    const jwtToken: string = localStorage.getItem(this.jwtKey);
    if (jwtToken) {
      const tokenExpirationDate: any = this.jwtHelper.getTokenExpirationDate(jwtToken);
      const isTokenExpired: any = this.jwtHelper.isTokenExpired(jwtToken);
      const dateNow: any = new Date();
      const dateToken: any = new Date(tokenExpirationDate);
      if (isTokenExpired) {
        this._auth.signOut();
      } else if (dateToken - dateNow < JWT_CHECK_TIMEOUT * 2) {
        this.updateToken();
      }
    } else {
      this.updateToken();
    }
  }

  /**
   * Updates localStorage user data
   */
  private updateStorageUserData() {
    const appUserStorageData: any = atob(localStorage.getItem(APP_USER));
    const storageUserData: any = appUserStorageData ? JSON.parse(appUserStorageData) : {};
    const jwtToken: string = localStorage.getItem(this.jwtKey);
    if (jwtToken) {
      const decodedToken: any = this.jwtHelper.decodeToken(jwtToken);
      localStorage.setItem(APP_USER, btoa(JSON.stringify(_.merge(decodedToken, storageUserData))));
    }
  }

  /**
   * Request update token
   */
  private updateToken() {
    this._auth.updateToken()
      .subscribe(
        (resp: any) => resp,
        (err: any) => { this._auth.signOut(); }
      );
  }
}
