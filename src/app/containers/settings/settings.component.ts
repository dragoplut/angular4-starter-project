import {
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, PermissionService } from '../../services/index';
import * as _ from 'lodash';

@Component({
  selector: 'settings',
  styleUrls: [ `./settings.component.scss` ],
  templateUrl: `./settings.component.html`
})
export class SettingsComponent implements OnInit {

  public settings: any = {};

  constructor(
    private _auth: AuthService,
    private _permission: PermissionService
  ) {}

  public ngOnInit() {
    if (!this._permission.isAllowedAction('view', 'settings')) {
      this._auth.signOut();
    }
  }

  public isAllowedAction(actionName: string, entityName: string) {
    return this._permission.isAllowedAction(actionName, entityName);
  }
}
