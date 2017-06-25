import { IDialogSettings, ITdDynamicElementConfig } from './types';
import { TdDynamicElement, TdDynamicType } from '@covalent/dynamic-forms';
import { ITdDataTableColumn } from '@covalent/core';
import * as moment from 'moment';

// tslint:disable-next-line
export const EMAIL_REGEXP: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// 10000 === 10 seconds
// for this.snackBar.open(... ,... , { duration: DURATION_ERROR_SNACKBAR })
export const DURATION_ERROR_SNACKBAR: number = 10000;
export const DURATION_NOTIFICATION_SNACKBAR: number = 5000;

// 30000 === 30 seconds
// for setInterval(... , JWT_CHECK_TIMEOUT)
export const JWT_CHECK_TIMEOUT: number = 30000;

export const DEFAULT_ERROR_MESSAGE: string = 'Some error occurs.';

export const DEFAULT_SUCCESS_MESSAGE: string = 'Changes saved.';

export const PAGES_LIST: [object] = [
  {
    listTitle: 'Users',
    routerLink: ['', 'users'],
    permissionRef: 'user',
    mdIcon: 'group'
  },
  {
    listTitle: 'Settings',
    routerLink: ['', 'settings'],
    permissionRef: 'settings',
    mdIcon: 'settings'
  },
  {
    listTitle: 'Sign out',
    routerLink: ['', 'signin'],
    permissionRef: 'signin',
    mdIcon: 'exit_to_app'
  }
];

export const CONFIRM_DIALOG_SETTINGS: IDialogSettings = {
  message: 'Are you sure?',
  disableClose: false, // defaults to false
  title: 'Confirm', // OPTIONAL, hides if not provided
  cancelButton: 'CANCEL', // OPTIONAL, defaults to 'CANCEL'
  acceptButton: 'CONFIRM', // OPTIONAL, defaults to 'ACCEPT'
};

export const USER_ROLES: [object] = [
  {value: 'admin', viewValue: 'Administrator'},
  {value: 'super', viewValue: 'Super Admin'},
  {value: 'user', viewValue: 'User'}
];

export const USER_STATUSES: [object] = [
  {value: 'disabled', viewValue: 'Disabled'},
  {value: 'enabled', viewValue: 'Enabled'}
];

export const MENU_YES_NO_BOOL: [object] = [
  {value: true, viewValue: 'YES'},
  {value: false, viewValue: 'NO'}
];

export const APP_USER: string = 'app_user';
export const REFRESH_TOKEN: string = 'refreshToken';
export const JWT_KEY: string = 'jwtToken';

// Role permission rules for users.
// Structure [role][entity][action/item][boolean]
export const PERMISSION_RULES: any = {
  admin: {
    settings: {
      view: true
    },
    signin: {
      view: true
    },
    admin: {
      create: false,
      delete: false,
      edit: true,
      role: false,
      status: false,
      password: true,
      view: true
    },
    super: {
      create: false,
      delete: false,
      edit: false,
      role: false,
      status: false,
      password: false,
      view: true
    },
    user: {
      create: true,
      delete: true,
      edit: true,
      role: true,
      status: true,
      password: true,
      view: true
    }
  },
  super: {
    settings: {
      view: true
    },
    signin: {
      view: true
    },
    admin: {
      create: true,
      delete: true,
      edit: true,
      role: true,
      status: true,
      password: true,
      view: true
    },
    super: {
      create: false,
      delete: false,
      edit: true,
      role: false,
      status: false,
      password: true,
      view: true
    },
    user: {
      create: true,
      delete: true,
      edit: true,
      role: true,
      status: true,
      password: true,
      view: true
    }
  },
  user: {
    settings: {
      view: true
    },
    signin: {
      view: true
    },
    admin: {
      create: false,
      delete: false,
      edit: false,
      role: false,
      status: false,
      password: false,
      view: false
    },
    super: {
      create: false,
      delete: false,
      edit: false,
      role: false,
      status: false,
      password: false,
      view: false
    },
    user: {
      create: false,
      delete: false,
      edit: false,
      role: false,
      status: false,
      password: true,
      view: true
    }
  }
};
