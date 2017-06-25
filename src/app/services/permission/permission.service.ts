import { Injectable } from '@angular/core';
import {
  APP_USER,
  PERMISSION_RULES
} from '../../constants';

@Injectable()
export class PermissionService {

  private activeAppUser: any = {};

  /**
   * Check if passed user is admin
   * @param user
   * @returns {boolean}
   */
  public isAdmin(user) {
    return user.role === 'admin' || user.role === 'super';
  }

  /**
   * Check passed user is active app user
   * @param user
   * @returns {boolean}
   */
  public isMe(user) {
    this.getAuthorizedUser();
    return user.id === this.activeAppUser.id;
  }

  /**
   * Active user permission check
   * Check if passed "action" is allowed in requested "entity"
   * Rules object structure [role][entity][action/item][boolean]
   * @param action
   * @param entity
   * @returns {boolean}
   */
  public isAllowedAction(action: string, entity: any) {
    this.getAuthorizedUser();
    return PERMISSION_RULES[this.activeAppUser.role] &&
      PERMISSION_RULES[this.activeAppUser.role][entity] ?
        PERMISSION_RULES[this.activeAppUser.role][entity][action] : false;
  }

  /**
   * Returns object with authorized app user
   */
  private getAuthorizedUser() {
    this.activeAppUser = localStorage.getItem(APP_USER) ?
      JSON.parse(atob(localStorage.getItem(APP_USER))) : '';
  }
}
