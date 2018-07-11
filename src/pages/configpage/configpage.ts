// Fazer máscara de bits para isso 0 - conectado e nao configurado, 1 - conectado e solicitando config de ligar, 2 - conf ligar setada 3 - solicitando desligar 4 - desligar setada 5 - solicitando aumentar 6 - aumentar setado 7 - solicitar diminuir 8 - diminuir setado 9  - conectado e configurado
import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { NavController , NavParams, LoadingController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { GlobalVariables } from '../../providers/globalvars/globalvars';

import { LigarPage } from './ligarpage/ligarpage';
import { DesligarPage } from './desligarpage/desligarpage';
import { TempsPage } from './tempspage/tempspage';


@Component({
    selector: 'page-config',
    templateUrl: 'configpage.html'
})
export class ConfigPage {

    pages: Array<{title: string, component: any}>;

    Page1 = LigarPage;
    Page2 = DesligarPage;
    Page3 = TempsPage;

    constructor( public  bluetoothSerial	: BluetoothSerial,
                 public  alertCtrl		: AlertController,
                public  navCtrl			: NavController,
                public  navParams		: NavParams,
                public  platform		: Platform,
                public  global			: GlobalVariables,
                public loadingCtrl: LoadingController,
                //public ligarPage: LigarPage
    ){
        platform.registerBackButtonAction( () => { this.voltar(); } , 1 );
        this.pages = [                                                                    // Páginas de config
            { title: 'Configure o botão de ligar'   ,      component: LigarPage },
            { title: 'Configure o botão de desligar',      component: DesligarPage },
            { title: 'Configure os sinais de temperatura', component: TempsPage }
        ];
    }
    voltar(){
		this.navCtrl.pop();
		console.log("Apertou botao de voltar!");
		return 0;
    }
    
    entrarNaConfig (page) {
        this.navCtrl.push(page.component);
        if(page.component == this.Page1) {
            this.global.checksets.ligar_setado.state = true;   // TESTANDO ICONE E NGIF
        }
        else if (page.component == this.Page2){
            this.global.checksets.desligar_setado.state = true;
        }
        else if (page.component == this.Page3){
            this.global.checksets.temps_setado.state = true;
        }
    }

    checa(page) {
        if(page.title == this.global.checksets.ligar_setado.title) {
            if(this.global.checksets.ligar_setado.state){
                return true;
            }    
            else {
                return false;
            }
        }
        else if(page.title == this.global.checksets.desligar_setado.title) {
            if(this.global.checksets.desligar_setado.state){
                return true;    
            }    
            else {
                return false;
            }
        }
        else if(page.title == this.global.checksets.temps_setado.title) {
            if(this.global.checksets.temps_setado.state){
                return true;
            }    
            else {
                return false;
            }
        }
        
    }
}