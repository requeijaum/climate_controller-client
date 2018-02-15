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

      })
  }
  
  
  success = (data) => alert(data);
  fail = (error) => alert(error);

  
  selectDevice(address: any , name:any) {

    let alert = this.alertCtrl.create({
      title: 'Conectar',
      message: 'Vocë quer conectar com esse dispositivo?',
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
			this.global.putAddress(address);
			this.global.putName(name);

			
			//esse enable() eh suspeito
			this.bluetoothSerial.enable();
			this.bluetoothSerial.write("\n {msg: \"Fan coil HEC conectado!\"}");
          }
        }
      ]
    });
    alert.present();

  }

  disconnect() {
    let alert = this.alertCtrl.create({
      title: 'Desconectar?',
      message: 'Vocë quer desconectar desse dispositivo?',
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
            this.bluetoothSerial.disconnect();
			console.log('this.bluetoothSerial.disconnect()');
          }
        }
      ]
    });
    alert.present();
  }
  


  
}

