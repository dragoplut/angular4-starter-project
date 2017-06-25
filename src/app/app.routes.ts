import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AuthService } from './services/index';
import {
  UsersComponent,
  SigninComponent,
  SettingsComponent,
  NoContentComponent,
  MainComponent
} from './containers/index';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',
    component: MainComponent,
    canActivate: [AuthService],
    children: [
      { path: '', redirectTo: 'signin', pathMatch: 'full' },
      { path: 'users', component: UsersComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  },
  { path: 'signin', component: SigninComponent },
  { path: '**', component: SigninComponent }
];
