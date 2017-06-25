import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { AuthService, ApiService, PermissionService } from '../../services/index';
import {
  APP_USER,
  DURATION_ERROR_SNACKBAR,
  DURATION_NOTIFICATION_SNACKBAR,
  DEFAULT_ERROR_MESSAGE,
  PAGES_LIST,
  JWT_KEY
} from '../../constants';

@Component({
  selector: 'signin',
  styleUrls: [ `./signin.component.scss` ],
  templateUrl: `./signin.component.html`,
  providers: [ AuthService, ApiService ]
})
export class SigninComponent implements OnInit {

  public user: any = {
    email: '',
    password: ''
  };
  public linkText: string = 'Want to be a Partner?';
  public loading: boolean = false;
  public isAuthErr: boolean = false;

  private PAGES_LIST: any = PAGES_LIST;

  constructor(
    private router: Router,
    private _auth: AuthService,
    private _api: ApiService,
    private _permission: PermissionService,
    private snackBar: MdSnackBar
  ) {}

  public ngOnInit() {
    this._api.setHeaders({});
  }

  public showErrorMessage(message?: string) {
    this.snackBar.open(
      message ? message : DEFAULT_ERROR_MESSAGE,
      'OK',
      {duration: DURATION_ERROR_SNACKBAR} as MdSnackBarConfig
    );
  }

  public authenticate() {
    localStorage.removeItem(JWT_KEY);
    this.loading = true;
    this._api.setHeaders({});
    this._auth.authenticate('signin', this.user)
      .subscribe(
        (resp: any) => {
          this.loading = false;
          if (this._permission.isAllowedAction('view', 'signin')) {
            for (const page of this.PAGES_LIST) {
              if (this._permission.isAllowedAction('view', page.permissionRef)) {
                this.router.navigate(page.routerLink);
                break;
              }
            }
          } else {
            this._auth.signOut();
            const message: string = 'You are not allowed to sign in!';
            this.showErrorMessage(message);
          }
          return resp;
        },
        (err: any) => {
          this.loading = false;
          if (err && err.status && err.status > 304) { this.isAuthErr = true; }
          const message = JSON.parse(err._body);
          this.showErrorMessage(message.error.message);
          return JSON.parse(err._body);
        }
      );
  }
}
