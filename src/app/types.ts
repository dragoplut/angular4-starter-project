import {
  ITdDynamicElementConfig,
  TdDynamicElement,
  TdDynamicType
} from '@covalent/dynamic-forms';

export interface ITdDynamicElementConfig {
  label?: string;
  name: string;
  type: TdDynamicType | TdDynamicElement;
  required?: boolean;
  min?: any;
  max?: any;
  default?: any;
  disabled?: boolean;
}

export interface IDialogSettings {
  message: string;
  disableClose?: boolean;
  title: string;
  cancelButton?: string;
  acceptButton?: string;
}

export interface UserDto {
  id: any;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email: string;
  password?: any;
  picture?: string;
  gender?: string;
  dob?: string;
  status?: any;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
}
