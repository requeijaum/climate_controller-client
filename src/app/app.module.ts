import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { GlobalVariables } from '../providers/globalvars/globalvars';

import { WelcomePage } from '../pages/01bemvindo/01bemvindo';
import { ConectarPage } from '../pages/02conectar/02conectar';
import { TemperaturaPage } from '../pages/temp/temp';
import { HorarioPage } from '../pages/hora/hora';

//import { CommTestPage } from '../pages/commtest/commtest';
//import { GridPage } from '../pages/flexbox/flexbox';
//import { ItemDetailsPage } from '../pages/item-details/item-details';
//import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';


@NgModule({
  declarations: [
    MyApp,
	WelcomePage,
	ConectarPage,
	TemperaturaPage,
	HorarioPage,
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
	TemperaturaPage,
	HorarioPage,
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
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
