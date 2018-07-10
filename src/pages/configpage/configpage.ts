// Fazer máscara de bits para isso 0 - conectado e nao configurado, 1 - conectado e solicitando config de ligar, 2 - conf ligar setada 3 - solicitando desligar 4 - desligar setada 5 - solicitando aumentar 6 - aumentar setado 7 - solicitar diminuir 8 - diminuir setado 9  - conectado e configurado
import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { NavController , NavParams, LoadingController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { GlobalVariables } from '../../providers/globalvars/globalvars';

import { LigarPage } from '../ligarpage/ligarpage';


@Component({
    selector: 'page-config',
    templateUrl: 'configpage.html'
})
export class ConfigPage {

    pages: Array<{title: string, component: any}>;

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
        this.pages = [
            { title: 'Configuracao do botao de ligar'    , component: LigarPage },
        ];
        this.ligar_setado = false;
        this.desligar_setado= false;
        this. aumentar_setado= false;
        this. diminuir_setado= false;
        this. passa_pagina= false;

    }
    ligar_setado: boolean;
    desligar_setado: boolean;
    aumentar_setado: boolean;
    diminuir_setado: boolean;
    passa_pagina: boolean;
    voltar(){
		this.navCtrl.pop();
		console.log("Apertou botao de voltar!");
		return 0;
    }
    
    entrarNaConfig (page) {
        this.navCtrl.push(page.component);
        if(page.component == this.pages[0].component) {
            this.ligar_setado = true;
        }
    }
}