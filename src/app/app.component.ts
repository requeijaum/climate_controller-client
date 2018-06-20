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
		{ title: 'Horários de acionamento'		  , component: HorarioPage },
		{ title: 'Pagina de Debug'              , component: DebugPage	},
		//{ title: 'CommTest'						        , component: CommTestPage },
		//{ title: 'GridPage'						        , component: GridPage },
		//{ title: 'My First List'				      , component: ListPage },
		//{ title: 'Timer'						          , component: TimerComponent }
	  ];
    
    this.global.debug = 0;
  
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

            if (this.bluetoothSerial.isConnected) {  // Mudar e usar com Promise
            

            var jsinho = this.PegadorJSON.pegaJSON();
            

            if (Object.is(this.global.JSONnovo , jsinho)){
              console.log("Objetos são iguais... não vou dar Object.assign()");              
              //falta algum timeout? algum async, await?    
            } else { 

              Object.assign(this.global.JSONnovo , jsinho);
            }

            //Acho que essas coisas bugam...            
            //console.log("app.component.ts - setInterval() funciona!")
            Object.assign( this.JSONnovo, this.global.JSONnovo);
            

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
            
            //this.atualizarJSONnovo_typeof( this.global.getJSONnovo_typeof() );
            
            //testar limpar
            //Reunião: acho que isso dá merda?
            //this.bluetoothSerial.clear()
            

            // Now the "this" still references the component
          }, 500);         				//setInterval daqui acontece antes
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
	if( (page.component == TemperaturaPage || page.component == HorarioPage) && this.global.getBluetoothConectado() == false ) {
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
	else {
		this.nav.setRoot(page.component);
	}
  }
  
  /*
    //https://github.com/don/BluetoothSerial/issues/222
	onData = function(buffer) {
		var BTbuffer = new Uint8Array(buffer);
		console.log("BTbuffer: " + BTbuffer);
	
	}
	*/
}