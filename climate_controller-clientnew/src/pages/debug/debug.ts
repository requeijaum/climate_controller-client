import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import { GlobalVariables } from '../../providers/globalvars/globalvars';

//import { TemperaturaPage } from '../temp/temp';


/**
 * Generated class for the DebugPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-debug',
  templateUrl: 'debug.html',
})
export class DebugPage {

    
  constructor(
      public navCtrl:   NavController, 
      public navParams: NavParams, 
      public platform:  Platform, 
      public global:    GlobalVariables,
      //public temp:      TemperaturaPage  
      ) 
  {
    
    
        platform.registerBackButtonAction( () => { this.voltar(); } , 1 );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DebugPage');
  }

  voltar(){
		this.navCtrl.pop();
		console.log("Apertou botao de voltar!");
		return 0;
	}

  /*
  aumentou_Tmin(){ this.temp.aumentou_Tmin();  }
  aumentou_Tmax(){ this.temp.aumentou_Tmax(); }

  diminuiu_Tmin(){ this.temp.diminuiu_Tmin(); }
  diminuiu_Tmax(){ this.temp.diminuiu_Tmax(); }
  */

}
