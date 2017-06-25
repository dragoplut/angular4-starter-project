import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnChanges
} from '@angular/core';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import {
  TdDialogService,
  ITdDataTableColumn,
  TdDataTableSortingOrder,
  ITdDataTableSortChangeEvent
} from '@covalent/core';
import {
  APP_USER,
  USER_ROLES,
  DURATION_ERROR_SNACKBAR,
  DEFAULT_SUCCESS_MESSAGE,
  CONFIRM_DIALOG_SETTINGS
} from '../../constants';
import {
  IDialogSettings,
  UserDto
} from '../../types';
import { ApiService, AuthService, PermissionService, UserService } from '../../services/index';
//noinspection TypeScriptCheckImport
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'users',
  providers: [ ApiService, PermissionService, TdDialogService, UserService],
  styleUrls: ['./users.component.scss'],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  public allUsers: any;

  // Flag for request in process
  public loading: boolean = false;

  // Sorting settings
  public currentPage: number = 1;
  public pageSize: number = 10;
  public paginationSettings: string = '';

  constructor(
    private snackBar: MdSnackBar,
    private _auth: AuthService,
    private _userService: UserService,
    private _permission: PermissionService,
    private _dialogService: TdDialogService
  ) {}

  public ngOnInit() {
    this.isAllowedAction('view', 'user') ? this.getUsers() : this._auth.signOut();
  }

  /**
   * Request users
   * @returns {any}
   */
  public getUsers() {
    this.loading = true;
    this.updatePaginationSettings();
    return this._userService.getUsers(this.paginationSettings)
      .subscribe(
        (resp: any) => {
          if (resp && resp.rows) {
            this.allUsers = resp.rows;
          } else {
            this.showSnackBarMessage('Error. Incorrect users data.');
          }
          this.loading = false;
        },
        (err: any) => { this._auth.checkAuth(err); }
      );
  }

  /**
   * Open confirm dialog for user delete action
   * @param event
   */
  public userDeleteConfirm(event?: any) {
    const dialogSettings: IDialogSettings = CONFIRM_DIALOG_SETTINGS;
    dialogSettings.message = 'Delete selected users?';
    this.confirmDialogOpen(dialogSettings, event, 'delete');
  }

  /**
   * Show snack bar with passed string
   * @param message
   */
  public showSnackBarMessage(message: string) {
    this.snackBar.open(message, 'OK', {duration: DURATION_ERROR_SNACKBAR} as MdSnackBarConfig);
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

  public isMe(user: UserDto) {
    return this._permission.isMe(user);
  }

  /**
   * Update pagination settings before request to back-end
   */
  private updatePaginationSettings() {
    this.paginationSettings = `?page=${this.currentPage}&limit=${this.pageSize}`;
  }

  /**
   * Trigger request action confirmed/approved
   * @param actionType
   * @param event
   */
  private triggerAction(actionType: string, event?: any) {
    switch (actionType) {
      case 'delete':
        console.log('triggerAction delete');
        break;
      case 'update':
        console.log('triggerAction update');
        break;
      default:
        break;
    }
  }

  /**
   * Handle "Confirm" dialog content and behavior.
   * dialogSettings   - dialog settings can be set/changed here,
   *                    see "IDialogSettings" in types.ts for details
   * event            - event with data to apply
   * action           - hook for further request, can be: delete, update
   * @param dialogSettings
   * @param event
   * @param action
   */
  private confirmDialogOpen(dialogSettings: IDialogSettings, event: any, action: string) {
    this._dialogService
      .openConfirm(dialogSettings)
      .afterClosed()
      .subscribe((accept: any) => {
        return accept ? this.triggerAction(action, event) : false;
      });
  }
}
