import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MomentModule } from 'angular2-moment';
import { TextMaskModule } from 'angular2-text-mask';
import { SwiperModule } from 'angular2-useful-swiper';
import {
  CovalentDialogsModule,
  CovalentSearchModule,
  CovalentDataTableModule,
  CovalentPagingModule
} from '@covalent/core';
import { DragulaModule } from 'ng2-dragula';
import { CovalentDynamicFormsModule } from '@covalent/dynamic-forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import 'hammerjs';
import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import {
  UsersComponent,
  MainComponent,
  SigninComponent,
  SettingsComponent,
  NoContentComponent
} from './containers/index';
import {
  LoadingSpinnerComponent,
  SideBarComponent,
  ToolBarComponent
} from './modules/index';
import * as services from './services/index';

import '../styles/styles.scss';

const mapValuesToArray = (obj) => Object.keys(obj).map((key: any) => obj[key]);
// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

interface StoreType {
  state: InternalStateType;
  restoreInputValues: () => void;
  disposeOldHosts: () => void;
}

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    UsersComponent,
    MainComponent,
    LoadingSpinnerComponent,
    SideBarComponent,
    SigninComponent,
    SettingsComponent,
    ToolBarComponent,
    NoContentComponent
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    DragulaModule,
    FormsModule,
    MaterialModule,
    MomentModule,
    NgxDatatableModule,
    HttpModule,
    SwiperModule,
    TextMaskModule,
    InfiniteScrollModule,
    BrowserAnimationsModule,
    CovalentDynamicFormsModule.forRoot(),
    CovalentDialogsModule.forRoot(),
    CovalentSearchModule.forRoot(),
    CovalentDataTableModule.forRoot(),
    CovalentPagingModule.forRoot(),
    RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules }),
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    ...mapValuesToArray(services)
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public appState: AppState
  ) {}

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      const restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
