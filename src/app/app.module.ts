import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { GlobalVariables } from '../providers/globalvars/globalvars';

import { WelcomePage } from '../pages/01bemvindo/01bemvindo';
import { ConectarPage } from '../pages/02conectar/02conectar';
import { ConfigPage } from '../pages/configpage/configpage';
import { TemperaturaPage } from '../pages/temp/temp';
import { HorarioPage } from '../pages/hora/hora';
import { DebugPage } from '../pages/debug/debug';

//import { CommTestPage } from '../pages/commtest/commtest';
//import { GridPage } from '../pages/flexbox/flexbox';
//import { ItemDetailsPage } from '../pages/item-details/item-details';
//import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import { PegadorJSON } from '../providers/pegajson/pegajson';


@NgModule({
  declarations: [
    MyApp,
	WelcomePage,
  ConectarPage,
  ConfigPage,
	TemperaturaPage,
  HorarioPage,
  DebugPage,
	//CommTestPage,
	//GridPage,
    //ItemDetailsPage,
    //ListPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
  ConectarPage,
  ConfigPage,
	TemperaturaPage,
  HorarioPage,
  DebugPage,
	//CommTestPage,
    //GridPage,
	//ItemDetailsPage,
    //ListPage,

  ],
  providers: [
	BluetoothSerial,
    StatusBar,
    SplashScreen,
	GlobalVariables,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  PegadorJSON,
    {provide: ErrorHandler, useClass: IonicErrorHandler}

  ]
})
export class AppModule {}
