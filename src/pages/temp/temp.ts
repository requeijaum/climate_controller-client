import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

//tentar travar a saida do aplicativo caso aperte o botao de voltar
import { NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import { AlertController } from 'ionic-angular';
import { GlobalVariables } from '../../providers/globalvars/globalvars';



//BUGS A CONSERTAR
//limites de temperatura



@Component({
  selector: 'page-temp',
  templateUrl: 'temp.html'
})


export class TemperaturaPage {



		constructor(public  bluetoothSerial	: BluetoothSerial,
					public  navCtrl			: NavController,
					public  navParams		: NavParams,
					public  platform		: Platform,
					public  alertCtrl		: AlertController,
					public  global			: GlobalVariables
					)

		{
			platform.registerBackButtonAction( () => { this.voltar(); } , 1 );

			//bluetoothSerial.enable();
			//bluetoothSerial.connect(this.address);

			//tentar pegar endereço em variável pública...
			//vou testar remover essa string ou referenciar...
			//talvez eu possa declarar uma classe em um arquivo e sempre usar
			//ela como um db
			//e chamar com um import

			//this.address = "00:0D:93:0F:57:E1"
			//this.texto = "Testando 1234"

			//esses valores resetam a cada visita de janela
			//preciso criar persistencia
			//this.t1 = 16;
			//this.t2 = 23;
			//this.t3 = 29;
			//this.p  = 0;
		}

	//public address: string;
	public texto: string;
	public recebido: string;
	//public tempTimer: any;
	public flagComm: boolean;

	public t1: any;
	public t2: any;
	public t3: any;
	public p:  any;

	public tt: any;

	//variaveis pra a page alterar o icone
	public presencaIcon : string;
	public presencaState: boolean;
	public presencaColor : string;


	//tentar travar a saida do aplicativo caso aperte o botao de voltar
	voltar(){
		this.navCtrl.pop();
		console.log("Apertou botao de voltar!");
		return 0;
	}

	//-------------------------------------------------------------------
	//debug
	ionViewDidEnter(){
		this.texto = "\n  Entrou em Temperatura! ionViewDidEnter() \r";
		console.log(this.texto);
		//this.bluetoothSerial.write(this.texto);

		//debug
		//this.carregarVars();


		if (this.platform.is('android')) {
			this.global.tempTimer = setInterval(() => {
				console.log("temp.ts - setInterval() funciona!");

				//this.rangeTemp();

				//debug
				this.carregarVars();
				this.global.PresencaIcone(parseInt(this.global.p));


				//testar
				//this.global.putTAtual(parseInt(this.global.JSONnovo.t2));

			}, 500);
		}
	}

	ionViewWillLeave(){
		this.texto = "Saiu   de Temperatura! ionViewWillLeave()";
		console.log(this.texto);
		//this.bluetoothSerial.write(this.texto);
		this.salvarVars();

	}

	ionViewDidLeave(){
		clearInterval(this.global.tempTimer);
	}


	//--------------------------------------------------------------------

	//PresencaIcone(valor){
	//	if (valor == 1){
	///		this.presencaIcon  = "radio-button-on"
	//		this.presencaState = true;
	//		this.presencaColor = "green"
	//		//this.p = 1;
	//	}
	//
	//	else {
	//		this.presencaIcon  = "radio-button-off"
	//		this.presencaState = false;
	//		this.presencaColor = "red"
	//		//this.p = 0;
	//	}
	//
	//}

	//-------------------------------------------------------------------------


	rangeTemp(){
		//range das temps
		//entre 15 e 30
		//o escopo é this. ? ou this.global. ?

		if(this.t1 < 16){
			this.t1 += this.t1;
		}

		if(this.t1 > 29){
			this.t1 -= this.t1;
		}

		if ((this.t1 < 16 && this.t1 > 29)) {
			this.texto = "\n { \"t1\": " + this.t1 + " } ";
			console.log(this.texto);
			this.bluetoothSerial.write(this.texto);
		}
		//
		if(this.t3 < 16){
			this.t3 += this.t3;
		}

		if(this.t3 > 29){
			this.t3 += this.t3;
		}

		if ((this.t3 < 16 && this.t3 > 29)) {
			this.texto = "\n { \"t1\": " + this.t1 + " } ";
			console.log(this.texto);
			this.bluetoothSerial.write(this.texto);
		}
	}




	//implementar um if e else pra alterar valores de temperatura
	//limitar valores entre 10 e 30 (graus celsius)

	//JSON.stringify() só aceita string...
	//não vou nem perder tempo refazendo o que está abaixo

	//chamar função pra carregar valores do JSON recebido?
	//função importante pra carregar variáveis a partir do
	//JSON recebido via Bluetooth
	carregarVars(){
		if (this.global.flagComm == false) {
			this.t1 	= this.global.getTMin();
			this.t2 	= this.global.getTAtual();
			this.t3 	= this.global.getTMax();

		}

		this.p 		= this.global.getPresenca();

		this.tt 	= this.global.getTtrigger();

		this.texto 	= this.global.getTexto();

		//---
		this.t1 	= parseInt(this.t1);	//funciona
		this.t2 	= parseInt(this.t2);	//testar
		this.t3 	= parseInt(this.t3);	//funciona

		this.p 		= parseInt(this.p);		//testar
		this.tt 	= parseInt(this.tt);	//funciona

		//adicionar .toNumber()? ... não!
		this.flagComm = this.global.flagComm;

		//---

		console.log("carregarVars()");
	}

	salvarVars(){
		//this.global.putTMin(this.t1);
		//putTAtual(this.t2); //não salvar... eu pq fico lendo sempre
		//this.global.putTMin(this.t3);
		//this.global.putTMin(this.p);
		//this.global.putTexto(this.texto);
		console.log("salvarVars() comentado");
	}

	aumentou_Tmin(){
		this.global.flagComm = true;

		this.t1 += 1;
		this.texto = "\n { \"t1\": " + this.t1 + " } ";
		console.log(this.texto);
		this.bluetoothSerial.write(this.texto);

		this.global.flagComm = false;
		//debug
		//this.global.putTMin(this.t1);
	}

	aumentou_Tmax(){
		this.global.flagComm = true;

		this.t3 += 1;
		this.texto = "\n { \"t3\": " + this.t3 + " } ";
		console.log(this.texto);
		this.bluetoothSerial.write(this.texto);

		this.global.flagComm = false;
		//debug
		//this.global.putTMax(this.t3);
	}

	diminuiu_Tmin(){
		this.global.flagComm = true;

		this.t1 -= 1;
		this.texto = "\n { \"t1\": " + this.t1 + " } ";
		console.log(this.texto);
		this.bluetoothSerial.write(this.texto);

		this.global.flagComm = false;
		//debug
		//this.global.putTMin(this.t1);
	}

	diminuiu_Tmax(){
		this.global.flagComm = true;

		this.t3 -= 1;
		this.texto = "\n { \"t3\": " + this.t3 + " } ";
		console.log(this.texto);
		this.bluetoothSerial.write(this.texto);

		this.global.flagComm = false;
		//debug
		//this.global.putTMax(this.t3);
	}

	debug_presenca_on(){
		//this.p = 1;
		//this.texto = "\n { \"p\": " + this.p + " } \r";
		//console.log(this.texto);
		//this.bluetoothSerial.write(this.texto);
		//debug
		//this.global.putPresenca(this.p);
		//this.global.PresencaIcone(this.p);
	}

	debug_presenca_off(){
		//this.p = 0;
		//this.texto = "\n { \"p\": " + this.p + " } \r";
		//console.log(this.texto);
		//this.bluetoothSerial.write(this.texto);
		//debug
		//this.global.putPresenca(this.p);
		//this.global.PresencaIcone(this.p);
	}


	alterarTtrigger()
	{
		let alert = this.alertCtrl.create({
			title: 'Entre com o tempo em minutos:',
			//subTitle: ,
			inputs:[
				{
					name: 'minutos',
					placeholder: this.tt.toString()
				}
			],

			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
					handler: data => {
						console.log('Clicou cancelar!');
					}
				},
				{
					text: "Alterar",
					handler: data => {
						//não precisa de this.global.flagComm = true;

						//console.log("data.minutos" = data);
						//pegar this.minutos, converter pra number e copiar pra this.tt
						this.tt = parseInt(data.minutos);

						this.texto = "\n { \"tt\": " + this.tt + " } ";
						this.bluetoothSerial.write(this.texto);
						console.log(this.texto);
						this.global.putTtrigger(this.tt);
					}
				 }
			]
			}

	);
		alert.present();
	}




}






