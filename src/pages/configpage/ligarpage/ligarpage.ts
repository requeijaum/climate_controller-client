import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { NavController , NavParams, LoadingController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { GlobalVariables } from '../../../providers/globalvars/globalvars';

@Component({
    selector: 'page-ligar',
    templateUrl: 'ligarpage.html'
})

export class LigarPage {
    constructor (   public bluetoothSerial: BluetoothSerial, 
                    public navCtrl:           NavController,
                    public platform:               Platform,
                    public alertCtrl:       AlertController,
                    public global:          GlobalVariables
                    ) {
                        platform.registerBackButtonAction( () => { this.voltar(); } , 1 );
                    }
                    voltar(){
                        this.navCtrl.pop();
                        console.log("Apertou botao de voltar!");
                        return 0;
                    }
}