import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, PermissionService } from '../../services/index';
import { PAGES_LIST } from '../../constants';

@Component({
  selector: 'side-bar',
  styleUrls: [ `./side-bar.component.scss` ],
  templateUrl: `./side-bar.component.html`
})
export class SideBarComponent implements OnInit {

  public appUser: string = '';
  public currentUser: any = this._auth.getCurrentUser();
  public pagesList: any = PAGES_LIST;

  constructor(
    private _auth: AuthService,
    private _permission: PermissionService,
    private router: Router
  ) {}

  public ngOnInit() {
    this.currentUser = this._auth.getCurrentUser();
    if (this.currentUser) {
      this.appUser = this.currentUser.email;
    } else {
      this._auth.signOut();
    }
  }

  public signOut() {
    this._auth.signOut();
  }

  public isAllowedAction(actionName: string, entityName: string) {
    return this._permission.isAllowedAction(actionName, entityName);
  }

  public goBack() {
    for (const page of this.pagesList) {
      if (this._permission.isAllowedAction('view', page.permissionRef)) {
        this.router.navigate(page.routerLink);
        break;
      }
    }
  }
}
