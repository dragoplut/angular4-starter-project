import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from '../index';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { APP_USER, REFRESH_TOKEN, JWT_KEY } from '../../constants';
import { UserDto } from '../../types';

@Injectable()
export class AuthService implements CanActivate {

  public REFRESH_KEY: string = REFRESH_TOKEN;
  public APP_USER: string = APP_USER;
  public JWT_KEY: string = JWT_KEY;
  public JWT: string = '';

  private appUser: string = '';

  constructor(
    private router: Router,
    private api: ApiService
  ) {
    const token = localStorage.getItem(this.JWT_KEY);
    const refreshToken = localStorage.getItem(this.REFRESH_KEY);
    if (token) {
      this.setJwt(token, refreshToken);
    }
  }

  /**
   * Update localStorage and request Headers with new token
   * @param jwt
   * @param refreshToken
   */
  public setJwt(jwt: string, refreshToken?: string) {
    localStorage.setItem(this.JWT_KEY, jwt);
    if (refreshToken) { localStorage.setItem(this.REFRESH_KEY, refreshToken); }
    if (jwt && localStorage.getItem(this.JWT_KEY)) {
      this.api.setHeaders({Authorization: `Bearer ${jwt}`});
    }
  }

  /**
   * Check if app user is authorised
   * @returns {Boolean}
   */
  public isAuthorized(): boolean {
    this.JWT = localStorage.getItem(this.JWT_KEY);
    return Boolean(this.JWT);
  }

  /**
   * Returns active app user object if it exist in localStorage
   * else sign out
   */
  public getCurrentUser() {
    const currentUser: any = localStorage.getItem(this.APP_USER);
    return currentUser ? JSON.parse(atob(currentUser)) : this.signOut();
  }

  /**
   * Page canActivate helper
   * @returns {boolean}
   */
  public canActivate(): boolean {
    const canActivate = this.isAuthorized();
    this.onCanActivate(canActivate);
    return canActivate;
  }

  /**
   * If page can't be reached, redirects to sign in/login
   * @param canActivate
   */
  public onCanActivate(canActivate: boolean) {
    if (!canActivate) {
      this.router.navigate(['', 'signin']);
    }
  }

  /**
   * Authenticates user
   * updates: localStorage, Headers
   * @param path
   * @param credits
   * @returns {any}
   */
  public authenticate(path, credits): Observable<any> {
    return this.api.post(`/${path}`, credits)
      .map((res: any) => {
        const userData: string = JSON.stringify(res.data);
        localStorage.setItem(this.APP_USER, btoa(userData));
        this.appUser = res.data;
        if (_.hasIn(res, 'data.authToken')) {
          this.appUser = res.data;
          this.JWT = res.data.authToken;
          this.setJwt(res.data.authToken, res.data.refreshToken);
        }
        return res.data;
      });
  }

  /**
   * Request update token
   * @returns {any}
   */
  public updateToken(): Observable<any> {
    const refreshKey: any = localStorage.getItem(this.REFRESH_KEY);
    if (!refreshKey) {
      this.signOut();
    }
    return this.api.post('/refresh_token', { token: refreshKey })
      .map(
        (res: any) => {
          if (_.hasIn(res, 'data.authToken')) {
            this.JWT = res.data.authToken;
            this.setJwt(res.data.authToken, res.data.refreshToken);
          }
          return res.data;
        },
        (err: any) => { this.signOut(); }
      );
  }

  /**
   * Check on 403 (Unauthorised) error and update token
   * if fails, make sign out
   * @param response
   */
  public checkAuth(response) {
    if (response && response.status && response.status === 403) {
      this.updateToken()
        .subscribe(
          (resp: any) => resp,
          (err: any) => { this.signOut(); }
        );
    }
  }

  /**
   * Sign out and clear localStorage user data
   */
  public signOut() {
    localStorage.removeItem(this.APP_USER);
    localStorage.removeItem(this.JWT_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    this.JWT = '';
    this.router.navigate(['signin']);
  }
}
