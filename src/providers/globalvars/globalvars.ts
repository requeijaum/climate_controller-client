import { Injectable } from "@angular/core"

//variáveis globais!
//https://forum.ionicframework.com/t/sharing-objects-between-components-pages/52891/6
//https://forum.ionicframework.com/t/solved-ionic-navcontroller-pop-with-params/58104/19

//usando esse:

//https://www.joshmorony.com/when-to-use-providersservicesinjectables-in-ionic/

//isso é um service?

//verificar property binding, two-way binding e input e outputs...

//https://www.infragistics.com/community/blogs/b/dhananjay_kumar/posts/simplifying-two-way-data-binding-in-angular-2

//https://angular.io/guide/displaying-data


//----------------------------------------------------


@Injectable()
export class GlobalVariables {

	//nulo, private ou public?
	public address			:string;
	public name				:string;
	public flagComm			:boolean;

	public texto			: 	string;
	public recebido			:string;
	public conectado		: boolean;

	public JSONnovo;
	public JSONnovo_typeof	: string;

	public horaTimer		: any;
	public tempTimer		: any;

	//eram numbers...
	public t1				: 	any;
	public t2				: 	any;
	public t3				: 	any;

	public p				: 	any;
	public tt				:	any;

	public pl1 				: 	number;
	public pl2				: 	number;
	public pd1 				: 	number;
	public pd2 				: 	number;

	public mask				: 	number;
	public dias;    		//objeto JSON, hehe
	public semana			: any;
	
	// Indica se o app está conectado ao dispositivo
	public bluetooth_connected : boolean;
	




	//variaveis pra a page alterar o icone
	public presencaIcon : string;
	public presencaState: boolean;
	public presencaColor: string;


	constructor(){
		this.address; //= "00:0D:93:0F:57:E1";
		//verificar se to alterando isso acima
		this.name;

		this.texto     	= "\nTestando texto...\r";
		this.recebido  	= "";
		this.conectado 	= false;

		this.flagComm 	= false;

		this.horaTimer;
		this.tempTimer;

		this.t1 	= 16;
		this.t2		= 23;			//teste
		this.t3		= 28;
		this.p      = 0;			//teste

		this.pl1	= 743;
		this.pl2	= 1200;
		this.pd1	= 1315;
		this.pd2	= 1700;

		this.mask	= 64;  //diferente do array

		this.dias 	= {
			seg: "true",
			ter: "false",
			qua: "false",
			qui: "false",
			sex: "false",
			sab: "false",
			dom: "false",
		}

		this.presencaIcon  = "radio-button-on"
		this.presencaState = true;
		this.presencaColor = "green"

		this.tt		= 5;

		//implementacao experimental
		this.JSONnovo_typeof;

		this.JSONnovo = {
			"a":0,
			"b":0,
			"m":0,
			"p":0,
			"pd1":1200,
			"pd2":1700,
			"pl1":700,
			"pl2":1300,
			"s":0,
			"t1":15,
			"t2":23,
			"t3":27,
			"tt":5
		}
		this.bluetooth_connected = false;




	}

	randomInt(min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	//resolver "this.global.PresencaIcone() is not a function"
	//coloquei um argumento, hehe

	PresencaIcone(valor){
		if (valor == 1){
			this.presencaIcon  = "radio-button-on"
			this.presencaState = true;
			this.presencaColor = "green"
			//this.p = 1;
		}

		else {
			this.presencaIcon  = "radio-button-off"
			this.presencaState = false;
			this.presencaColor = "red"
			//this.p = 0;
		}

	}

	//pegar funcao periodica via setInterval() em pages/temp/temp.ts
	//enviaPeriodico(texto){
	//
	//	console.log(texto);
	//
	//}



	//---

	getAddress(){ return this.address;	}
	putAddress(address){ this.address = address;	}

	getName(){ return this.name;	}
	putName(name){ this.name = name;	}

	getTexto(){ return this.texto;		}
	putTexto(texto){ this.texto = texto;	}

	//---

	//URGENTE
	//--> melhorar codigo anti-burro, colocar uma funcao no timerTemp

	getTMin(){ return this.t1; }
	putTMin(t1){ this.t1 = t1;}


	getTAtual(){ return this.t2; }
	putTAtual(t2) {	this.t2 = t2; }


	getTMax(){ return this.t3; 	}

	putTMax(t3){ this.t3 = t3; }

	getPresenca(){ return this.p; }
	putPresenca(p){ this.p = p; }

	//---

	getPL1(){ return this.pl1;	}
	putPL1(pl1){ this.pl1 = pl1;}

	getPL2(){ return this.pl2;	}
	putPL2(pl2){ this.pl2 = pl2;}

	getPD1(){ return this.pd1;	}
	putPD1(pd1){ this.pd1 = pd1;}

	getPD2(){ return this.pd2;	}
	putPD2(pd2){ this.pd2 = pd2;}

	//---

	getDias(){ return this.dias;	}
	putDias(dias){ this.dias = dias;}

	getMask(){ return this.mask ;	}
	putMask(mask){ this.mask = mask ;}

	//funciona
	getSemana(){ return this.semana ;	}
	putSemana(semana){ this.semana = semana ;}

	//tempo de ação do controlador...
	getTtrigger(){ return this.tt; }
	putTtrigger(tt){ this.tt = tt; }


	//experimental
	getRecebido(){ return this.recebido ;	}

	//pode ter sido falha aqui
	getJSONnovo(){ return this.JSONnovo ; 	}
	putJSONnovo(JSONnovo){
		this.JSONnovo = JSONnovo ; //recebe e armazena na classe "global" ou "this.global"

	}
	// Bluetooth está conectado
	getBluetoothConectado() { return this.bluetooth_connected; }
	putBluetoothConectado(bluetooth_connected) { this.bluetooth_connected = bluetooth_connected; }
	
	getJSONnovo_typeof(){ return this.JSONnovo_typeof ;}
	putJSONnovo_typeof(JSONnovo_typeof){ this.JSONnovo_typeof = JSONnovo_typeof;	}

}
