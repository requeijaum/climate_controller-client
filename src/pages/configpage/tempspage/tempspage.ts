import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { NavController , NavParams, LoadingController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { GlobalVariables } from '../../../providers/globalvars/globalvars';

@Component({
    selector: 'page-temps',
    templateUrl: 'tempspage.html',
    animations: [
        trigger('btnAnimation', [
            state('start' , style({
                opacity:0,
                color: 'green',
                float: 'right',
                background: 'transparent',
                display:'inline-block',
                padding:'0.35em 1.2em',
                margin:'0 0.3em 0.3em 0',
                width: '30em'
            })),
            state('end', style({
                opacity:1,
                color: 'green',
                float: 'right',
                background: 'transparent',
                display:'inline-block',
                padding:'0.35em 1.2em',
                margin:'0 0.3em 0.3em 0',
                width: '11em'
            })),
            transition('start => end', animate (1500))
        ])
    ]
})

export class TempsPage {

    s: number;
    saux: number;
    public loader: any;
    solicitouGravacao: boolean;
    solicitouTeste: boolean;
    tempaux: any;
    pickerColumns1: any;
    pickerColumns2: any;
    constructor (   public bluetoothSerial: BluetoothSerial, 
                    public navCtrl:           NavController,
                    public platform:               Platform,
                    public alertCtrl:       AlertController,
                    public global:          GlobalVariables,
                    public loadingCtrl:   LoadingController
                    ) {
                        this.pickerColumns1 = [ 
                            {
                                name: 'Temperatura Minima',
                                options: [
                                    { text: '15°', value: '15', disabled: false },
                                    { text: '16°', value: '16', disabled: false },
                                    { text: '17°', value: '17', disabled: false },
                                    { text: '18°', value: '18', disabled: false },
                                    { text: '19°', value: '19', disabled: false },
                                    { text: '20°', value: '20', disabled: false },
                                    { text: '21°', value: '21', disabled: false },
                                    { text: '22°', value: '22', disabled: false },
                                    { text: '23°', value: '23', disabled: false },
                                    { text: '24°', value: '24', disabled: false },
                                    { text: '25°', value: '25', disabled: false },
                                    { text: '26°', value: '26', disabled: false },
                                    { text: '27°', value: '27', disabled: false },
                                    { text: '28°', value: '28', disabled: false },
                                    { text: '29°', value: '29', disabled: false },
                                    { text: '30°', value: '30', disabled: false }
                                ]
                            }];
                            this.pickerColumns2 = [
                                {
                                    name: 'Temperatura Máxima',
                                    options: [
                                        { text: '15°', value: '15', disabled: false },
                                        { text: '16°', value: '16', disabled: false },
                                        { text: '17°', value: '17', disabled: false },
                                        { text: '18°', value: '18', disabled: false },
                                        { text: '19°', value: '19', disabled: false },
                                        { text: '20°', value: '20', disabled: false },
                                        { text: '21°', value: '21', disabled: false },
                                        { text: '22°', value: '22', disabled: false },
                                        { text: '23°', value: '23', disabled: false },
                                        { text: '24°', value: '24', disabled: false },
                                        { text: '25°', value: '25', disabled: false },
                                        { text: '26°', value: '26', disabled: false },
                                        { text: '27°', value: '27', disabled: false },
                                        { text: '28°', value: '28', disabled: false },
                                        { text: '29°', value: '29', disabled: false },
                                        { text: '30°', value: '30', disabled: false }
                                    ]
                            }
                            ]
                        platform.registerBackButtonAction( () => { this.voltar(); } , 1 );
                        this.global.tempsTimer = setInterval( 
                            () => {
                                this.s = this.global.s;
                                if(this.solicitouGravacao && (this.s && 2)) {   // Sinal gravado
                                    this.solicitouGravacao = false;
                                    this.global.checksets.ligar_setado.state = true;
                                    this.loader.dismiss();
                                    let alert = this.alertCtrl.create({
                                        title: "O comando foi gravado",
                                        message: "Teste o botão e verifique se tudo foi feito corretamente. Caso tenha algum problema, faça a gravação novamente. Se o erro persistir, chame um responsável.",
                                        buttons: [ {
                                            text: 'Ok',
                                            handler: () => {
                                                console.log("Clicou em ok!");
                                            }

                                        }]
                                    });
                                    alert.present();
                                }
                                if(this.solicitouTeste && (this.s && 8)) { // Teste  foi realizado
                                    this.solicitouTeste;
                                    this.loader.dismiss();
                                    let alert = this.alertCtrl.create({
                                        title: "O teste foi realizado",
                                        message: "Caso algum problema tenha ocorrido, faça a gravação novamente. Se o erro persistir, chame um responsável.",
                                        buttons: [ {
                                            text: 'Ok',
                                                handler: () => {
                                                    console.log("Clicou em ok!");
                                                }
                                        }, {
                                                text: 'Gravar novamente',
                                                handler: () => {
                                                    this.enviaSolicitacaoGravacao(this.tempaux);
                                                }
                                            }]
                                    });
                                    alert.present();
                                }
                                this.atualizaTemps();
                                this.atualizaPickers();
                                //this.atualizarTMINColumn();
                            } , 1000);
                                
                        }
                    
                        

                    public event = { 
                        TMIN: '17', 
                        TMAX: '30' 
                    }

                    public temperaturas = [];

                    atualizaTemps () {
                        for(var i=0; i<this.temperaturas.length; i++ ) {
                            if( (this.temperaturas[i] < parseInt(this.event.TMIN)) || (this.temperaturas[i] > parseInt(this.event.TMAX)) ) {
                                this.temperaturas.splice(i,1);
                            }
                        }
                        for(i=parseInt(this.event.TMIN); i<=parseInt(this.event.TMAX); i++ ) {
                            if(this.temperaturas.indexOf(i.toString()) == -1) {
                                this.temperaturas.push(i.toString());
                                this.temperaturas.sort();
                            }
                        }
                    }

                    atualizaPickers () {
                        let imin, imax;
                        imin = this.pickerColumns1[0].options.map(x => x.value).indexOf(this.event.TMIN);
                        imax = this.pickerColumns1[0].options.map(x => x.value).indexOf(this.event.TMAX);
                        for(var i= imax; i<this.pickerColumns1[0].options.length; i++) {
                            //alert(i);
                            //alert(i<this.pickerColumns1[0].options.length);
                            this.pickerColumns1[0].options[i].disabled = true;
                        }
                        for(i = imin; i>=0; i--) {
                            this.pickerColumns2[0].options[i].disabled = true;
                        }
                        for(i= imin;i<imax; i++) {
                            if(i != imax){
                                this.pickerColumns1[0].options[i].disabled = false;
                            }
                            if(i != imin) {
                                this.pickerColumns2[0].options[i].disabled = false;
                            }
                        }
                    }

                    enviaSolicitacaoGravacao(temp) {
                        this.solicitouGravacao = true;
                        this.saux = this.s;
                        this.saux +=1;
                        this.bluetoothSerial.write("\n { \"s\": " + this.saux + " , \"d\": \"" + temp + "\" } ");
                        this.loader = this.loadingCtrl.create({
                            content: "Mude a temperatura para " + temp + "° no seu controle apenas uma vez e aguarde o dispositivo registrar...",
                        });
                        this.loader.present();
                        setTimeout( () => {
                            if(this.solicitouTeste) {
                                let alert = this.alertCtrl.create({
                                    title: "Erro",
                                    message: "Ocorreu um erro na gravação. Tente novamente. Se o erro persistir, chame um responsável.",
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
                    
                    enviaSolicitacaoTeste(temp) {
                        //if(this.s)
                            this.tempaux = temp;
                            this.solicitouTeste = true;
                            this.saux = this.s;
                            this.saux += 4;
                            this.bluetoothSerial.write("\n { \"s\": " + this.saux + " , \"d\": \"" + temp + "\" } ");
                            this.loader = this.loadingCtrl.create({
                                content: "Aguarde enquanto o dispositivo processa seu comando e envia o sinal para seu aparelho",
                            });
                            this.loader.present();
                            setTimeout( () => {
                                if(this.solicitouTeste) {
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
                    temp: any;/*
                    atualizarTMINColumn () {
                        // remover o que não é para estar lá
                        for(var i=0;i<14;i++) {
                            if(parseInt(this.pickerColumns1.options[i].value) >= parseInt(this.event.TMAX)) {
                                this.pickerColumns1.options.slice(i,1);
                            }
                        }
                        // adicionar o que deve estar
                        for(var i=parseInt(this.event.TMIN);i<parseInt(this.event.TMAX);i++) {
                            this.temp = {
                                text:  i + '°',
                                value: i.toString()
                            }
                            if(this.pickerColumns1.options.indexOf(this.temp) == -1) {
                                this.pickerColumns1.options.push(this.temp);
                                this.pickerColumns1.options.sort();
                            }
                        }
                    }*/
                    voltar(){
                        this.navCtrl.pop();
                        console.log("Apertou botao de voltar!");
                        return 0;
                    }
}