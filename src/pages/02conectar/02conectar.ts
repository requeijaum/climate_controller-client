import { Component } from '@angular/core';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AlertController } from 'ionic-angular';

//tentar travar a saida do aplicativo caso aperte o botao de voltar
import { NavController , NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { GlobalVariables } from '../../providers/globalvars/globalvars';

@Component({
  selector: 'page-conectar',
  templateUrl: '02conectar.html'
})


export class ConectarPage {

  unpairedDevices: any;
  pairedDevices:   any;
  gettingDevices:  Boolean;
	bluetoothEnabled: Boolean;
	
  public address: string;
  
  constructor(	public  bluetoothSerial: BluetoothSerial, 
				public  alertCtrl: AlertController,
				public  navCtrl: NavController,
				public  navParams: NavParams,
				public  platform: Platform,
				public  global			: GlobalVariables
				) 
  {
	platform.registerBackButtonAction( () => { this.voltar(); } , 1 );
    bluetoothSerial.enable();
  }


	voltar(){
		this.navCtrl.pop();
		console.log("Apertou botao de voltar!");
		return 0;
	}
  
  startScanning() {
	  
    this.pairedDevices = null;
		this.unpairedDevices = null;
		
		this.bluetoothSerial.isEnabled().then( () => {        // Verifica se o bluetooth esta ligado, se estiver pesquisa, se nao solicita o ligamento do bluetooth.
			this.gettingDevices = true;
			this.bluetoothSerial.discoverUnpaired().then((success) => {
				this.unpairedDevices = success;
				this.gettingDevices = false;
			
				success.forEach(element => {
					// alert(element.name);
				});
			
			},
				(err) => {
					console.log(err);
				})
	
			this.bluetoothSerial.list().then((success) => {
				this.pairedDevices = success;
			},
				(err) => {
	
				});
		} , (err) => {
			this.bluetoothSerial.enable();
		 } );
  }
  
  
  success = (data) => { let alert = this.alertCtrl.create({                  // success = (data) => alert(data);
						  title: 'Sucesso',
						  message: 'O dispositivo foi conectado.',
						  buttons: [
							{
							  text: 'Ok',
							  handler: () => {
								console.log('Apertou ok!');
							  }
							},
						  ]
						});
						alert.present();
						console.log(data);
					  };
  fail = (error) => { let alert = this.alertCtrl.create({             // fail = (error) => { alert(error)};  || Imagino que numa versão pasa usuário seja 
						  title: 'Erro',                                         	// viável mostrar apenas 'a conexão foi perdida'. O erro em si se envia pelo log, 
						  message: 'A conexão com o dispositivo foi perdida.',   	// para análise aprofundada.
						  buttons: [																							// Reunião: conseguimos saber que a conexão foi perdida... de qualquer página fora de "conectar"?
							{
							  text: 'Ok',
							  handler: () => {
								console.log('Apertou ok!');
							  }
							},
						  ]
						});
						alert.present();
						console.log(error);
					};

  
  selectDevice(address: any , name:any) {                   
	if( this.global.bluetooth_connected == false ) {                 		// Se o aplicativo nao estiver conectado a um dispositivo, você o conecta ao dispositivo
		let alert = this.alertCtrl.create({                            		// selecionado.
		  title: 'Conectar',
		  message: 'Você quer conectar com esse dispositivo?',
		  buttons: [
			{
			  text: 'Cancelar',
			  role: 'cancel',
			  handler: () => {
				console.log('Cancelou conexão...');
			  }
			},
			{
			  text: 'Conectar',
			  handler: () => {
				this.bluetoothSerial.connect(address).subscribe(this.success, this.fail);
				console.log('this.bluetoothSerial.connect(address).subscribe(this.success, this.fail)');
				
				//seria bom eu exportar o endereço do dispositivo e ouras variáveis
				//para uma variável global?

				//Rafael não fez isso:
				//this.global.address = address;
				
				//dá ruim... vamos usar isso:

				this.global.putAddress(address);
				this.global.putName(name);

				
				//esse enable() eh suspeito
				this.bluetoothSerial.enable();
				this.bluetoothSerial.write("\n {msg: \"Fan coil HEC conectado!\"}");  //Reunião: implementar "msg" no JSON do Arduino
			  }
			}
		  ]
		});
		alert.present();
	}
	else {                                                                // Se já estiver conectado. Imprima mensagem de erro.
		let alert = this.alertCtrl.create({                  
						  title: 'Erro',
						  message: 'Seu aparelho já está conectado a um dispositivo. Desconecte-se do dispositivo para realizar esta ação.',
						  buttons: [
							{
							  text: 'Ok',
							  handler: () => {
								console.log('Apertou ok!');
							  }
							},
						  ]
						});
						alert.present();
	}

  }

  disconnect() {
		if( this.global.bluetooth_connected == true ) {
			let alert = this.alertCtrl.create({
				title: 'Desconectar?',
				message: 'Você quer desconectar desse dispositivo?',
				buttons: [
					{
						text: 'Cancelar',
						role: 'cancel',
						handler: () => {
							console.log('Cancelou desconectar');
						}
					},
					{
						text: 'Desconectar',
						handler: () => {
							this.unpairedDevices = null;                // Limpa lista de dispositivos, obrigando o usuário a buscar novamente.
							this.bluetoothSerial.disconnect();
				console.log('this.bluetoothSerial.disconnect()');
						}
					}
				]
			});
			alert.present();
		}
		else {
			let alert = this.alertCtrl.create({                  
				title: 'Erro',
				message: 'O dispositivo precisa estar conectado para realizar esta ação.',
				buttons: [
				{
					text: 'Ok',
					handler: () => {
					console.log('Apertou ok!');
					}
				},
				]
			});
			alert.present();
		}
  }
  


  
}

