import { Component } from '@angular/core';

//tentar travar a saida do aplicativo caso aperte o botao de voltar
import { NavController ,NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-01bemvindo',
  templateUrl: '01bemvindo.html'
})
export class WelcomePage {
	constructor(public navCtrl: NavController,
				public navParams: NavParams,
				public platform: Platform) 
	{
		platform.registerBackButtonAction( () => { this.voltar(); } , 1 );
	}

	voltar(){
		this.navCtrl.pop();
		console.log("Apertou botao de voltar!");
		return 0;
	}


}

