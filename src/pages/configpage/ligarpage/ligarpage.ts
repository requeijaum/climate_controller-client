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
    s: number;
    public loader: any;

    constructor (   public bluetoothSerial: BluetoothSerial, 
                    public navCtrl:           NavController,
                    public platform:               Platform,
                    public alertCtrl:       AlertController,
                    public global:          GlobalVariables
                    ) {
                        platform.registerBackButtonAction( () => { this.voltar(); } , 1 );
                    }
                    ionViewDidEnter() {
                        if(this.platform.is('Android')) {
                            this.global.ligarTimer = setInterval ( 
                                () => { 
                                        this.s = this.global.s;
                                        if(this.s && 2) {   // Botao ligar foi gravado
                                            
                                        }
                                        if(this.s && 8) { // Teste do botao ligar foi realizado

                                        }
                                      } , );
                        }
                    }

                    enviaSolicitacaoGravacao() {
                        let saux = this.s;
                        saux +=1;
                        // envia s pelo bluetooth
                    }

                    enviaSolicitacaoTeste() {
                        let saux = this.s;
                        saux += 4;
                        //envia saux pelo bluetooth
                    }

                    voltar(){
                        this.navCtrl.pop();
                        console.log("Apertou botao de voltar!");
                        return 0;
                    }
}