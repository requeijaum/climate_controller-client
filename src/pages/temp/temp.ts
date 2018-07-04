import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

//tentar travar a saida do aplicativo caso aperte o botao de voltar
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import { AlertController } from 'ionic-angular';
import { GlobalVariables } from '../../providers/globalvars/globalvars';

//vamos testar @Injectable() pra poder usar as funções descritas aqui... em outra page
import { Injectable } from "@angular/core"


//BUGS A CONSERTAR
//limites de temperatura



@Component({
  selector: 'page-temp',
  templateUrl: 'temp.html'
})


@Injectable()
export class TemperaturaPage {



		constructor(public  bluetoothSerial	: BluetoothSerial,
					public  navCtrl			: NavController,
					public  navParams		: NavParams,
					public  platform		: Platform,
					public  alertCtrl		: AlertController,
					public  global			: GlobalVariables,
					public loadingCtrl: LoadingController
					)

		{
			platform.registerBackButtonAction( () => { this.voltar(); } , 1 );
			this.contaComm = 0;
			this.aumentouTmax = false;
			this.aumentouTmin = false;
			this.diminuiuTmax = false;
			this.diminuiuTmin = false;
			this.alterouTtrigger = false;

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

	public contaComm: number;

	public t1: any;
	public t2: any;
	public t3: any;
	public p:  any;

	public tt: any;

	//variaveis pra a page alterar o icone
	public presencaIcon : string;
	public presencaState: boolean;
	public presencaColor : string;

	public tempaux: any;
	public aumentouTmax: boolean;
	public aumentouTmin: boolean;
	public diminuiuTmax: boolean;
	public diminuiuTmin: boolean;
	public ttaux: any;       
	public alterouTtrigger: boolean; //lidar com o loader

	public loader: any;



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
				if(this.aumentouTmax && this.global.t3 == this.tempaux) {
					this.loader.dismiss();
					this.aumentouTmax = false;
					this.tempaux = 0;
				}
				if(this.aumentouTmin && this.global.t1 == this.tempaux) {
					this.loader.dismiss();
					this.aumentouTmin = false;
					this.tempaux = 0;
				}
				if(this.diminuiuTmax && this.global.t3 == this.tempaux) {
					this.loader.dismiss();
					this.diminuiuTmax = false;
					this.tempaux = 0;
				}
				if(this.diminuiuTmin && this.global.t1 == this.tempaux) {
					this.loader.dismiss();
					this.diminuiuTmin = false;
					this.tempaux = 0;
				}
				if(this.alterouTtrigger && this.global.tt == this.ttaux) {               // NAO ESTA FUNCIONANDO AINDA!
					this.loader.dismiss();
					this.alterouTtrigger = false;
					this.ttaux = 0;
				}
				this.global.PresencaIcone(parseInt(this.global.p));


				//testar
				//this.global.putTAtual(parseInt(this.global.JSONnovo.t2));

			}, 100); // era 500
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

	/*
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
	}	*/ //Acho que essa parte não do código não é mais necessária, mas devo confirmar com Rafael.




	//implementar um if e else pra alterar valores de temperatura
	//limitar valores entre 10 e 30 (graus celsius)

	//JSON.stringify() só aceita string...
	//não vou nem perder tempo refazendo o que está abaixo

	//chamar função pra carregar valores do JSON recebido?
	//função importante pra carregar variáveis a partir do
	//JSON recebido via Bluetooth
	carregarVars(){
		//this.contaComm = 0; //Reuniao: Contador para debug
			this.t1 	= this.global.getTMin();
			this.t2 	= this.global.getTAtual();
			this.t3 	= this.global.getTMax();

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

	//Reunião: verificar lance do range de temperaturas e correção proposta por Lucas

	public aumentou_Tmin(){
		if(this.global.flagComm) {  // DEBUG
			this.contaComm++;
		}
		if( this.t3 - (this.t1+1) >= 2) {                             // Se o valor da temperatura máxima subtraído do aumento da Temperatura mínima feito resultar 
			this.global.flagComm = true;
			this.t1 += 1;                                             // em um número que seja maior ou  igual a temperatura máxima 2, o que não pode acontecer, 
			this.texto = "\n { \"t1\": " + this.t1 + " } ";           // tendo em mente de que a temperatura  deve ficar entre os dois valores. Se a Tmin for 29 e a 
			console.log(this.texto);                                  // Tmax for 30. isso não será possível  já que não existe número inteiro entre 29 e 30. A não 
			this.bluetoothSerial.write(this.texto);                   // ser que o código assuma 29 e 30 como parte do intervalo. Preciso averiguar.
			this.tempaux = this.t1;
			this.aumentouTmin = true;
			this.loader = this.loadingCtrl.create({
				content: "Aguarde enquanto o dispositivo processa seu comando...",
			  });
			this.loader.present();
			setTimeout( () => {
				if(this.aumentouTmin) {
					alert("Ocorreu um erro no envio/recebimento do dado.");
					this.loader.dismiss();
				}
				
			 } , 6000);
		}
		else {
			let alert = this.alertCtrl.create( {
				title: 'Erro',
				message: 'Deve existir um intervalo de pelo menos 1° Celsius entre a temperatura máxima e mínima.',
				buttons: [ 
				{ text: 'Ok',
					handler: () => {
						console.log('Clicou em Ok.');
					}
				} ]
			} );
			alert.present();
				
		}
		//debug
		//this.global.putTMin(this.t1);
	}

	public aumentou_Tmax(){
		if(this.global.flagComm) {
			this.contaComm++;
		}
		if(this.t3+1 <30) {                                    // Se quando o aumento feito o resultado for menor do que 30, é possível fazer o aumento.
			this.global.flagComm = true;
			this.t3 += 1;
			this.texto = "\n { \"t3\": " + this.t3 + " } ";
			console.log(this.texto);
			this.bluetoothSerial.write(this.texto);
			this.tempaux = this.t3;
			this.aumentouTmax = true;
			this.loader = this.loadingCtrl.create({
				content: "Aguarde enquanto o dispositivo processa seu comando...",
			  });
			this.loader.present();
			setTimeout( () => {
				if(this.aumentouTmax) {
					alert("Ocorreu um erro no envio/recebimento do dado.");
					this.loader.dismiss();
				}
				
			 } , 6000);
		}
		else {                                                // Se o aumento feito resultar em uma temperatura maior do que 29, não se deve aumentar. Ou seja, não faz nada. TESTE
			let alert = this.alertCtrl.create( {
				title: 'Erro',
				message: 'A temperatura máxima deve ser menor do que 30° Celsius.',
				buttons: [ 
				{ text: 'Ok',
					handler: () => {
						console.log('Clicou em Ok.');
					}
				} ]
			} );
			alert.present();
		}
		//debug
		//this.global.putTMax(this.t3);
	}

	public diminuiu_Tmin(){
		if(this.global.flagComm) {
			this.contaComm++;
		}
		if(this.t1-1 > 16) {
			this.global.flagComm = true;
			this.t1 -= 1;
			this.texto = "\n { \"t1\": " + this.t1 + " } ";
			console.log(this.texto);
			this.bluetoothSerial.write(this.texto);
			this.tempaux = this.t1;
			this.diminuiuTmin = true;
			this.loader = this.loadingCtrl.create({
				content: "Aguarde enquanto o dispositivo processa seu comando...",
			  });
			this.loader.present();
			setTimeout( () => {
				if(this.diminuiuTmin) {
					alert("Ocorreu um erro no envio/recebimento do dado.");
					this.loader.dismiss();
				}
				
			 } , 6000);


		}
		else {
			let alert = this.alertCtrl.create( {
				title: 'Erro',
				message: 'A temperatura mínima deve ser maior do que 16° Celsius.',
				buttons: [ 
				{ text: 'Ok',
					handler: () => {
						console.log('Clicou em Ok.');
					}
				} ]
			} );
			alert.present();
		}
		this.global.flagComm = false;
		//debug
		//this.global.putTMin(this.t1);
	}

	public diminuiu_Tmax(){
		this.tempaux = this.t3;
		if(this.global.flagComm) {
			this.contaComm++;
		}
		if( (this.t3 -1) - this.t1 >= 2 ) {
			this.global.flagComm = true;
			this.t3 -= 1;
			this.texto = "\n { \"t3\": " + this.t3 + " } ";
			console.log(this.texto);
			this.bluetoothSerial.write(this.texto);
			this.tempaux = this.t3;
			this.diminuiuTmax = true;
			this.loader = this.loadingCtrl.create({
				content: "Aguarde enquanto o dispositivo processa seu comando...",
			  });
			this.loader.present();
			setTimeout( () => {
				if(this.diminuiuTmax) {
					alert("Ocorreu um erro no envio/recebimento do dado.");
					this.loader.dismiss();
				}
				
			 } , 6000);
		}
		else {
			let alert = this.alertCtrl.create( {
				title: 'Erro',
				message: 'Deve existir um intervalo de pelo menos 1° Celsius entre a temperatura máxima e mínima.',
				buttons: [ 
				{ text: 'Ok',
					handler: () => {
						console.log('Clicou em Ok.');
					}
				} ]
			} );
			alert.present();
		}
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


	public alterarTtrigger()
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
						if(this.tt <= 60) {
							this.texto = "\n { \"tt\": " + this.tt + " } ";
							
							this.bluetoothSerial.write(this.texto);
							console.log(this.texto);
							
							//Reunião: o comando abaixo pode estar redundante...
							//this.global.putTtrigger(this.tt); Estava redundante e podia causar problemas no codigo.
							this.ttaux = this.tt;
							this.alterouTtrigger = true;
							this.loader = this.loadingCtrl.create({
								content: "Aguarde enquanto o dispositivo processa seu comando...",
							});
							this.loader.present();
							setTimeout( () => {
								if(this.alterouTtrigger) {
									let alert = this.alertCtrl.create({
										title: "Erro",
										message: "Ocorreu um erro no envio/recebimento do dado.",
										buttons: [
											{
												text: 'Ok',
												handler: () => {
													console.log("Clicou em ok!");
												}
											}
										]
									})
									alert.present();
									this.loader.dismiss();
								}
								
							} , 6000);
						}
						else {
							let subalert = this.alertCtrl.create({
								title: "O tempo de ação deve ser menos de uma hora.",
								message: "Aperte \"Ok\" para digitar um novo valor ou \"Cancelar\" para cancelar a ação.",
								buttons: [
									{
										text: "Ok",
										handler: () => {
											this.alterarTtrigger();
										}
									},
									{
										text: "Cancelar",
										handler: () => {
											console.log("Apertou cancelar.");
										}
									}
								]
						});
						subalert.present();
					}
				 }
				}
			]
			}

	);
		alert.present();
	}
}






