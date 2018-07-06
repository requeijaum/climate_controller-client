import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, AlertController } from 'ionic-angular';
import { GlobalVariables } from '../providers/globalvars/globalvars';

import { WelcomePage } from '../pages/01bemvindo/01bemvindo';
import { ConectarPage } from '../pages/02conectar/02conectar';
import { TemperaturaPage } from '../pages/temp/temp';
import { HorarioPage } from '../pages/hora/hora';
import { DebugPage } from '../pages/debug/debug';

//import { CommTestPage } from '../pages/commtest/commtest';
//import { GridPage } from '../pages/flexbox/flexbox';
//import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { PegadorJSON } from '../providers/pegajson/pegajson';


@Component({
  templateUrl: 'app.html'
})

export class MyApp {
	@ViewChild(Nav) nav: Nav;
	
  public recebido : string;
  public JSONnovo;
	
	public onError  : any; //acho que n uso... mas n vou mexer //eu uso isso???
	
	// make WelcomePage the root (or first) page
	rootPage = WelcomePage;
	pages: Array<{title: string, component: any}>;

  constructor(
		public bluetoothSerial:     BluetoothSerial, 
		public platform: 		        Platform,
		public menu: 			          MenuController,
		public statusBar: 		      StatusBar,
		public splashScreen: 	      SplashScreen,
		public global: 			        GlobalVariables,
		public alertCtrl:           AlertController,
    public PegadorJSON:         PegadorJSON
  ) 
	{

    this.initializeApp();

    // set our app's pages
    this.pages = [
		{ title: 'Controle do Fancoil - HEC'    , component: WelcomePage },
		{ title: 'Conectar dispositivo'			    , component: ConectarPage },
		{ title: 'Temperatura'					        , component: TemperaturaPage },
		{ title: 'Horários de acionamento'		  , component: HorarioPage }//,
		//{ title: 'Pagina de Debug'              , component: DebugPage	},
		//{ title: 'CommTest'						        , component: CommTestPage },
		//{ title: 'GridPage'						        , component: GridPage },
		//{ title: 'My First List'				      , component: ListPage },
		//{ title: 'Timer'						          , component: TimerComponent }
	  ];
    
    this.global.debug = 0;
    this.global.JSONvalido = false;
  }
    
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
	    this.splashScreen.hide();
	  
	    //debug
	    this.global.debug = 0;
      
      //tentar tirar o Runtime Error quando testo no browser
      //via "$ ionic serve" 
      if (this.platform.is('android')) {
      
        //nao vou parar esse timer nunca...	 
        setInterval(() => { 
            this.bluetoothSerial.isConnected()                                   // Verifica constantemente se o aplicativo está conectado ao dispositivo.
            .then(() => {                                                        // e altera a variável global.
                    this.global.putBluetoothConectado(true);
                  }, (err) => {
                        this.global.putBluetoothConectado(false);
                        });
                        
          
            this.global.recebido = this.PegadorJSON.JSONpeguei.toString();
        
            //talvez esse if com && this.global.flagComm esteja travando tudo

            if (this.global.bluetooth_connected) {  // Mudar e usar com promisse att: Ou usar a variavel global que voce criou bobao...
              //alert("debug"); // Testando funcionamento da condicional
              /*this.bluetoothSerial.subscribeRawData()
                .subscribe(
                      (data) => { 
                        //this.bluetoothSerial.read()
                        this.bluetoothSerial.readUntil("}")
                          .then(
                            (data) => { 
                              setTimeout(this.global.recebido = data, 100);
                            },
                          //),  Isso ta errado ctz...
                          
                            () =>  { 
                              console.log("this.bluetoothSerial.read() pegou ERRO"); 
                          }); // acho q era pra ser aq
                          
                          
                          
                          
                          var bytes = new Uint8Array(data);
                          alert(bytes);
                          function ab2str(buf) {
                            return String.fromCharCode.apply(null, new Uint8Array(buf));
                            }
                            this.global.recebido = ab2str(data);
                      }, () => {
                        this.global.debug++;
                      }
                    
                );*/
                this.bluetoothSerial.readUntil("}").then(      // Problema com buffer truncado. att: Nao mais. Após o encapsulamento da promisse o problema foi resolvido!
                  (data) => {
                    this.global.recebido = data;
                    //--> conserter essa merda logo!
      
                    //inventar alguma Promise pra pegar a exception do JSON.parse() ?
      
                    //substituir aspas simples por aspas duplas...
                    //a ArduinoJSON e Python3 usam aspas diferentes
                    //codigo unicode correspondente...
      
                    //Reunião: podemos otimizar isso no Observable anterior?
      
                    this.global.recebido = this.global.recebido.replace(/\u0027/g, '\u0022').replace(/[\r\n]/g, ''); 
          
                    //this.global.recebido = "{\"a\":0,\"b\":0,\"m\":0,\"p\":1,\"pd1\":1200,\"pd2\":1740,\"pl1\":1000,\"pl2\":1630,\"s\":0,\"t1\":22,\"t2\":26,\"t3\":29,\"tt\":15}";
      
                    //testar se o objeto que vai pra global está vazio
          
                    //https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
                    try {
                      var ObjetoNovo = JSON.parse(this.global.recebido);
                      this.global.JSONvalido = true;
                    }
                    catch (SyntaxError) {
                      console.log("String recebida nao é um JSON.");
                    }
                    //alert(JSON.stringify(ObjetoNovo));
      
                    //implementar um promisse pra error handling
          
                    this.global.putObjetoNovo_length (Object.getOwnPropertyNames(ObjetoNovo).length);
                    
          
                    if ( Object.getOwnPropertyNames(ObjetoNovo).length != 10) {
                      console.log("ObjetoNovo \"JSON.parse(this.global.recebido nao esta completo!\" ");
                      /*
                      let alert = this.alertCtrl.create({                  // success = (data) => alert(data);
                        title: 'DEU MERDA',
                        message: 'QCU',
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
                        */
                    } 
      
                    //Reunião: a seguinte lógica pode dar problema...?
      
                    if ( Object.getOwnPropertyNames(ObjetoNovo).length  >= 10) { // >= 10 para simulador. == 10 para arduino atualizado.
                      // &... é igual ao objeto antigo, hehe
                      if ( !(Object.is( this.global.JSONnovo , ObjetoNovo) )) { //if (not(boolean))
                        //se antigo !== novo
                        //atualiza
                        this.global.JSONnovo = Object.assign( {}, ObjetoNovo );			
                      }
                      if ( Object.is( this.global.JSONnovo , ObjetoNovo) ) {
                        //se antigo == novo
                        //Não atualiza
              
                        console.log("ObjetoNovo & global.JSONnovo são iguais. Não atualizar.");
                      }
                    }
          
      
          
          
                    //testar	
                    //copia objetos
      
          
                    this.global.putTMin  	(this.global.JSONnovo.t1);
                    this.global.putTAtual	(parseInt(this.global.JSONnovo.t2));
                    this.global.putTMax		(this.global.JSONnovo.t3);
      
                    this.global.putPresenca	(parseInt(this.global.JSONnovo.p));
                    this.global.putTtrigger	(this.global.JSONnovo.tt);
          
                    this.global.putPL1		(this.global.JSONnovo.pl1);
                    this.global.putPL2		(this.global.JSONnovo.pl2);
                    this.global.putPD1		(this.global.JSONnovo.pd1);
                    this.global.putPD2		(this.global.JSONnovo.pd2);
          
                    this.global.putMask		(this.global.JSONnovo.m);
           
                    //this.atualizarJSONnovo_typeof( this.global.getJSONnovo_typeof() ); Aparentemente isso sumiu
          
                    //testar limpar
                    //Reunião: acho que isso dá merda?
                    //this.bluetoothSerial.clear()
          
      
                    // Now the "this" still references the component
                  } , () => {
                    alert("Ocorreu um problema na comunicação com o dispositivo.")
                  }
                );
              //alert("teste");
              console.log("bluetoothSerial.read() = " + this.global.recebido);
            }
          
          
          
          }, 100);         				//setInterval daqui acontece antes
          //500 ou 750 ou mais?			//dos existentes nas pages temperatura e horario
          //1000 ou 1500					//logo: envia o que ta na page mas antes... 
                          //recebe os valores do arduino
      
                          //Lucas: Aumentando o intervalo para tentar resolver o problema de comunicação com o arduino
          }
        });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    if( (page.component == TemperaturaPage || page.component == HorarioPage) && !this.global.getBluetoothConectado() ) {
      let alert = this.alertCtrl.create( {
          title: 'Erro',
          message: 'Voce precisa se conectar ao dispositivo antes de acessar esta página.',
          buttons: [ 
          { text: 'Ok',
            handler: () => {
              console.log('Clicou em Ok.');
              if(this.nav.getActive().component != this.pages[1].component) {
                this.openPage(this.pages[1]);
                console.log('Abriu a página conectar a partir de: ' + this.nav.getActive().name );
              }
            }
          } ]
        } );
        alert.present();
    }
    else if( (page.component == TemperaturaPage || page.component == HorarioPage) && this.global.getBluetoothConectado() && !this.global.JSONvalido ) {
      let alert = this.alertCtrl.create( {
        title: 'Erro',
        message: 'O dispositivo que você está conectado não é compatível com o funcionamento do aplicativo. Se você tem certeza de que se conectou ao dispositivo correto, comunique um responsável.',
        buttons: [ 
        { text: 'Ok',
          handler: () => {
            console.log('Clicou em Ok.');
          }
        } 
      ]
      } );
      alert.present();
    }
    else if( (this.nav.getActive().component == this.pages[3].component) && this.global.alteroudados) {
        let alert = this.alertCtrl.create({
          title: "Suas alterações não foram enviadas.",
          message: "Envie suas alterações pelo botao, ou saia sem enviar.",
          buttons: [
            {
              text: "Ok",
              handler: () => {
                console.log("Apertou Ok");
              }
            },
            {
              text: "Sair sem enviar.",
              handler: () => {
                this.nav.setRoot(page.component);
                console.log("Saiu sem enviar os dados.");
              }
            }
          ]
        });
        alert.present();   
    }
    else {
      this.nav.setRoot(page.component);
    }
  }

  openConnect() {
    this.openPage(this.pages[1]);
  }

  
  /*
    //https://github.com/don/BluetoothSerial/issues/222
	onData = function(buffer) {
		var BTbuffer = new Uint8Array(buffer);
		console.log("BTbuffer: " + BTbuffer);
	
	}
	*/
}