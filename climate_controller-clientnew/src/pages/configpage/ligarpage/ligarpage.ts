import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { NavController , LoadingController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { GlobalVariables } from '../../../providers/globalvars/globalvars';
import { DesligarPage } from '../desligarpage/desligarpage';

@Component({
    selector: 'page-ligar',
    templateUrl: 'ligarpage.html',
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

export class LigarPage {
    s: number;
    saux: number;
    public loader: any;
    solicitouGravacao: boolean;
    solicitouTeste: boolean;

    nextPage = DesligarPage;

    constructor (   public bluetoothSerial: BluetoothSerial, 
                    public navCtrl:           NavController,
                    public platform:               Platform,
                    public alertCtrl:       AlertController,
                    public global:          GlobalVariables,
                    public loadingCtrl:     LoadingController
                    ) {
                        platform.registerBackButtonAction( () => { this.voltar(); } , 1 );
                        this.solicitouGravacao = false;
                        this.solicitouTeste = false;
                    }
                    ionViewDidEnter() {
                        setInterval ( 
                            () => { this.animacaoBotao (); } , 1500);
                        if(this.platform.is('Android')) {
                            this.global.ligarTimer = setInterval ( 
                                () => { 
                                        this.animacaoBotao ();
                                        this.s = this.global.s;
                                        if(this.solicitouGravacao && (this.s && 2)) {   // Botao ligar foi gravado
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
                                            this.saux = this.s;
                                            this.saux = 0;
                                            this.bluetoothSerial.write("\n { \"s\": " + this.saux + " } ");
                                        }
                                        if(this.solicitouTeste && (this.s && 8)) { // Teste do botao ligar foi realizado
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
                                                        this.enviaSolicitacaoGravacao();
                                                    }
                                                }]
                                            });
                                            alert.present();
                                            this.saux = this.s;
                                            this.saux = 0;
                                            this.bluetoothSerial.write("\n { \"s\": " + this.saux + " } ");
                                        }
                                      } , 1000);
                        }
                    }
                    ionViewDidLeave(){
                        clearInterval(this.global.ligarTimer);
                    }
                    enviaSolicitacaoGravacao() {
                        this.solicitouGravacao = true;
                        this.saux = this.s;
                        this.saux +=1;
                        this.bluetoothSerial.write("\n { \"s\": " + this.saux + " , \"d\": \"l\" } ");
                        this.loader = this.loadingCtrl.create({
                            content: "Aperte o botão de ligar do seu controle apenas uma vez e aguarde o dispositivo registrar...",
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
                    
                    enviaSolicitacaoTeste() {
                        //if(this.s)
                            this.solicitouTeste = true;
                            this.saux = this.s;
                            this.saux += 4;
                            this.bluetoothSerial.write("\n { \"s\": " + this.saux + " , \"d\": \"l\" } ");
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
                    // Ignorar por enquanto
                    allSet() {
                        if(this.global.checksets.ligar_setado.state) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }

                    // Funçao para gerenciar animação do botao de proximo passo
                    animacaoBotao () {
                        if(!this.global.entrouPagLigarPosSet && this.global.checksets.ligar_setado.state) {
                            this.global.entrouPagLigarPosSet = true;
                            this.global.buttonLigarPageState = 'end';
                        }
                        else if(!this.global.checksets.ligar_setado.state) {
                            this.global.entrouPagLigarPosSet = false;
                            this.global.buttonLigarPageState = 'start';
                        }
                    }
                    // Ação do botão de proximo passo
                    proximoPasso () {
                        this.navCtrl.pop();
                        this.navCtrl.push(this.nextPage);
                        this.global.checksets.desligar_setado.state = true;
                    }
                    
                    voltar(){
                        this.navCtrl.pop();
                        console.log("Apertou botao de voltar!");
                        return 0;
                    }
}