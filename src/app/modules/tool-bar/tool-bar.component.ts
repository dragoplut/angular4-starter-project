import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, PermissionService } from '../../services/index';
import { PAGES_LIST } from '../../constants';
// tslint:disable-next-line
import * as _ from 'lodash';

@Component({
  selector: 'tool-bar',
  styleUrls: [ `./tool-bar.component.scss` ],
  templateUrl: `./tool-bar.component.html`
})
export class ToolBarComponent implements OnInit, OnDestroy {

  // Get current user data from localStorage for usage in menu
  public currentUser: any = this._auth.getCurrentUser();
  // Get pages list to generate menu items
  public pagesList: any = PAGES_LIST;
  // Pate title depends on current route url
  public pagesTitle: string = '';

  // Event subscriber for router
  private subscriber: any;

  constructor(
    private router: Router,
    private _auth: AuthService,
    private _permission: PermissionService
  ) {}

  public ngOnInit() {
    this.currentUser = this._auth.getCurrentUser();
    // If current app user data unavailable, sign out.
    if (!this.currentUser) {
      this._auth.signOut();
    }
    // Listen for route change and update tool-bar title
    this.subscriber = this.router.events.subscribe((params: any) => {
      const routerUrl: any = this.router.url;
      const routeName: string = routerUrl.match(/\/([a-zA-Z0-9]{0,})/);
      this.pagesTitle = _.toUpper(routeName[1]);
    });
  }

  public ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  /**
   * Sign out user from app
   */
  public signOut() {
    this._auth.signOut();
    this.router.navigate(['', 'signin']);
  }

  /**
   * Check user permission
   * @param actionName
   * @param entityName
   * @returns {boolean}
   */
  public isAllowedAction(actionName: string, entityName: string) {
    return this._permission.isAllowedAction(actionName, entityName);
  }

  /**
   * Redirects to first allowed page.
   * If nothing is allowed, redirects to login
   */
  public goBack() {
    for (const page of this.pagesList) {
      if (this._permission.isAllowedAction('view', page.permissionRef)) {
        this.router.navigate(page.routerLink);
        break;
      }
    }
  }
}
