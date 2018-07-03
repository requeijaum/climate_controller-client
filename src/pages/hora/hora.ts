import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

//tentar travar a saida do aplicativo caso aperte o botao de voltar
import { NavController , NavParams, LoadingController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import { AlertController } from 'ionic-angular';

import { GlobalVariables } from '../../providers/globalvars/globalvars';


//BUGS A CONSERTAR
//pegar JSON e os objetos de horarios para alterar o event que mostra os turnos nos botoes
//tentar mostrar os dias que estao programados - checkboxes em cima do botao de envio


@Component({
	  selector: 'page-hora',
	  templateUrl: 'hora.html'
})
export class HorarioPage {

		constructor(public  bluetoothSerial	: BluetoothSerial,
					public  alertCtrl		: AlertController,
					public  navCtrl			: NavController,
					public  navParams		: NavParams,
					public  platform		: Platform,
					public  global			: GlobalVariables,
					public loadingCtrl: LoadingController
					)

		{
			platform.registerBackButtonAction( () => { this.voltar(); } , 1 );

			//bluetoothSerial.enable();
			//bluetoothSerial.connect(this.address);

			//tentar pegar endereço em variável pública...
			//vou testar remover essa string ou referenciar...
			//talvez eu possa declarar uma classe em um arquivo e sempre usar
			//ela como um db
			//e chamar com um import

			//this.address = "00:0D:93:0F:57:E1"
			//this.texto = "Testando 1234"

			//this.pl1  = 743;
			//this.pl2  = 1200;
			//this.pd1  = 1315;
			//this.pd2  = 1700;
			//this.dias = {};
			//this.mask = 0;
		}
	//fim do construtor

	//classe inicia

	//public address: string;
	public texto: string;
	public recebido: string;
	//public horaTimer: any;
	public flagComm: boolean;

	pl1 : string; // vamos testar como string. era number
	pl2 : string;
	pd1 : string;
	pd2 : string;

	//vou ter problemas, acho
	a1: any;
	a2: any;
	b1: any;
	b2: any;
	c1: any;
	c2: any;
	d1: any;
	d2: any;

	dias; //objeto
	mask: number;
	semana: any;

	pl1aux: string; // Implementando o loader
	pl2aux: string;
	pd1aux: string;
	pd2aux: string;
	maskaux: number;
	alteroudados: boolean;

	public loader: any;



	//-------------------------------------------------------------------
	//debug

	//tentar carregar o event antes da page
	//ionViewWillEnter(){
	//	this.carregarVars();
	//
	//}

	ionViewWillLoad(){

		//bypass flagComm

		this.mask 	= this.global.getMask();

		//testar funcao nova pra ler mask e obter semana no estado inicial

		//this.global.dias = this.testaMaskEmSemana(this.mask);
    this.dias 	= this.global.getDias();


		//normal... antes de entrar
		this.carregarVars();
		this.carregarEvent();

		//corrigir ion-radios no estado inicial da page?
		//this.mask 	= this.global.getMask();

	}

	ionViewDidEnter(){
		this.texto = "Entrou em Horarios! ionViewDidEnter()";
		console.log(this.texto);
		this.bluetoothSerial.write(this.texto);

		//mudar ordem
		//this.carregarVars();
		//this.carregarEvent();


		if (this.platform.is('android')) {
			//setInterval(() => {
		//		alert("globalmask = " + this.global.mask + " global.pl1 = " + this.global.pl1 + " global.pl2 = " + this.global.pl2 + " global.pd1 = " + this.global.pd1 + " global.pd2 = " + this.global.pd2  );
	//	}, 5000);
			this.global.horaTimer = setInterval(() => {

				console.log("temp.ts - setInterval() funciona!");

				this.carregarVars();
				//alert("pd1: " + this.pd1 + " pd1 aux: " + this.pd1aux + " pd1global: " + this.global.pd1 );
				if(this.alteroudados && (this.maskaux == this.global.mask) && (this.pl1aux == this.global.pl1) && (this.pd1aux == this.global.pd1) && (this.pl2aux == this.global.pl2) && (this.pd2aux == this.global.pd2) ) {
					this.alteroudados = false;
					this.loader.dismiss();
					this.carregarVars();
					this.numerosTratados();
					this.carregarEvent();
					this.maskaux = -1;
					this.pl1aux = "";
					this.pl2aux = "";
					this.pd1aux = "";
					this.pd2aux = "";

				}
				this.pegaEvent();
				//this.carregarEvent();

				//ver uma flagEvent aí
				//atualmente ta com bug temporal
				

			}, 100); // era 100
		}

		//testar algoritmos depois de ter recebido o primeiro JSON
		this.mask = this.global.getMask();
		this.ArrayToDias( this.arrayFromMask(this.mask) );


	}

	ionViewWillLeave(){
		this.texto = "Saiu   de Horarios! ionViewWillLeave()";
		console.log(this.texto);
		this.bluetoothSerial.write(this.texto);
		this.salvarVars();

	}

	ionViewDidLeave(){
		clearInterval(this.global.horaTimer);
	}


	//chamar função pra carregar valores do JSON recebido?
	//função importante pra carregar variáveis a partir do
	//JSON recebido via Bluetooth

	carregarVars(){

	//testando a flag de comm
	if (this.global.flagComm == false) {


		this.pl1 	= this.global.getPL1();
		this.pl2 	= this.global.getPL2();
		this.pd1	= this.global.getPD1();
		this.pd2 	= this.global.getPD2();



		this.dias 	= this.global.getDias();
		//this.mask 	= this.global.getMask();   //tentar resolver mask undefined
		this.semana = this.global.getSemana();
	}


		this.texto 	= this.global.getTexto();


		this.numerosTratados();

		//testar
		this.flagComm = this.global.flagComm;

		console.log("carregarVars()");
	}

	pegaEvent() {
		this.f_pl1();	this.f_pl2();	this.f_pd1(); 	this.f_pd2();
	}
	salvarVars(){
		//this.global.putPL1(this.pl1);
		//this.global.putPL2(this.pl2);
		//this.global.putPD1(this.pd1);
		//this.global.putPD2(this.pd2);

		//this.global.putDias(this.dias);
		//this.global.putMask(this.mask);

		console.log("salvarVars() comentado");
	}


  //eu uso essas funcoes de array abaixo???

	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators

	arrayFromMask(nMask) {
		// nMask must be between -2147483648 and 2147483647
		if (nMask > 0x7fffffff || nMask < -0x80000000) {
			throw new TypeError('arrayFromMask - out of range');
		}
		for (var nShifted = nMask, aFromMask = []; nShifted;
		   aFromMask.push(Boolean(nShifted & 1)), nShifted >>>= 1);
		console.log(aFromMask);
		return aFromMask;
	}



	ArrayToDias(array){
		if ( true || array.length == 7) {
			//sou burro, nao sei iterar com 2 for aqui
			this.dias.seg = array[0];
			this.dias.ter = array[1];
			this.dias.qua = array[2];
			this.dias.qui = array[3];
			this.dias.sex = array[4];
			this.dias.sab = array[5];
			this.dias.dom = array[6];

		}

	}






	//preciso pegar a hora de event.P** e jogar em um alerta ou lista...
	//preciso verificar se consigo manipular os valores dentro de event.

	f_pl1(){
		if(this.pl1 != this.event.PL1.replace(":", "")) {
			this.alteroudados = true;
		}
		//this.pl1 = this.event.PL1.replace(":", "");
		//this.pl1 = parseInt(pl1);
		//this.texto = "\n { \"pl1\": " + this.pl1 + " } \r";
		//console.log(this.texto);
		//this.bluetoothSerial.write(this.texto);

		//this.global.putPL1(this.pl1);
	}

	f_pl2(){
		if(this.pl2 != this.event.PL2.replace(":", "")) {
			this.alteroudados = true;
		}
		//this.pl2 = this.event.PL2.replace(":", "");

		//this.pl2 = parseInt(pl2);
		//this.texto = "\n { \"pl2\": " + this.pl2 + " } \r";
		//console.log(this.texto);
		//this.bluetoothSerial.write(this.texto);

		//this.global.putPL2(this.pl2);
	}

	f_pd1(){
		if(this.pd1 != this.event.PD1.replace(":", "")) {
			this.alteroudados = true;
		}
		//this.pd1 = this.event.PD1.replace(":", "");

		//this.pd1 = parseInt(pd1);
		//this.texto = "\n { \"pd1\": " + this.pd1 + " } \r";
		//console.log(this.texto);
		//this.bluetoothSerial.write(this.texto);

		//this.global.putPD1(this.pd1);
	}

	f_pd2(){

		if(this.pd2 != this.event.PD2.replace(":", "")) {
			this.alteroudados = true;
		}
		//this.pd2 = this.event.PD2.replace(":", "");


		//this.pd2 = parseInt(pd2);
		//this.texto = "\n { \"pd2\": " + this.pd2 + " } \r";
		//console.log(this.texto);
		//this.bluetoothSerial.write(this.texto);

		//this.global.putPD2(this.pd2);
	}



	voltar(){
		this.navCtrl.pop();
		console.log("Apertou botao de voltar!");
		return 0;
	}



	//eu quem adicionou o public a esses dois abaixo... devo tirar?
	testCheckboxOpen: boolean;
	testCheckboxResult;



	doCheckbox() {

		console.log("Abriu checkbox para programar dias da semana!");

		let alert = this.alertCtrl.create();
		alert.setTitle('Ligar em quais dias?');

		//fazer algo pra ler o estado de cada checkbox
		//usando global.dias ...
		//acessar o objeto... HURR DURR

		alert.addInput({
		  type: 'checkbox',
		  label: 'Segunda-feira',
		  value: 'seg',
		  //checked: true
		});

		alert.addInput({
		  type: 'checkbox',
		  label: 'Terça-feira',
		  value: 'ter',
		  //checked: true
		});

		alert.addInput({
		  type: 'checkbox',
		  label: 'Quarta-feira',
		  value: 'qua',
		  //checked: true
		});

		alert.addInput({
		  type: 'checkbox',
		  label: 'Quinta-feira',
		  value: 'qui',
		  //checked: true
		});

		alert.addInput({
		  type: 'checkbox',
		  label: 'Sexta-feira',
		  value: 'sex',
		  //checked: true
		});

		alert.addInput({
		  type: 'checkbox',
		  label: 'Sábado',
		  value: 'sab',
		  //checked: false
		});

		alert.addInput({
		  type: 'checkbox',
		  label: 'Domingo',
		  value: 'dom',
		  //checked: false
		});


		alert.addButton({
			  text: 'Cancelar',
			  handler: () => {
				console.log('Cancelou programação dos dias...');
			  }
		});

		alert.addButton({
		  text: 'Enviar dados',
		  handler: data => {
				console.log('Checkbox data:', data);
				this.testCheckboxOpen   = false;
				this.testCheckboxResult = data;

				//zerar valores do objeto this.dias
				//var coisaprazerar = this.dias;

				//for(const k in coisaprazerar){
				//	this.dias[k] = false;
				//}

				//levar cada entrada no objeto para 1, caso o dia for escolhido em cada checkbox
				//
				//this.data = this.testarCheckboxData(data); ?
				//console.log("depois de this.testarCheckboxData(): " + JSON.stringify(this.//testarCheckboxData(data)));

				this.testaSemanaEmObjeto(data, this.dias);


				//meh...
				//não copiar objeto pra this.dias... os nomes são diferentes pra cada item
				//this.dias = Object.assign( this.dias , this.testCheckboxResult);

				//this.dias 			= JSON.stringify(this.dias);


				//aqui, olha
				//as checkboxes alteram this.dias... vamos recarregar pra essa page
				//this.global.putDias(this.dias);

				this.enviaCheckbox();

		   }
		});

		alert.present().then(() => {
		  this.testCheckboxOpen = true;
		});

	}


	testaSemanaEmObjeto(arr, obj) {   //entra checkbox data e sai this.dias

		var copy = obj;

		function checkAvailability(arr, dia){
			arr.some(dia => dia == dia );
		}

		//zerar valores do objeto this.dias.
		for( const x in copy ){
			obj[x] = false;

		}


		for (const k in arr) {
			var dia = arr[k];

			//strict mode diz que isso da erro...
			//na hora da build pra android...
			//function checkAvailability(arr, dia) {
			//	return arr.some(function(arrDia) {
			//		return dia === arrDia;
			//	});
			//}
			//transformei em arrow function :-P
			checkAvailability(arr, dia);



			copy[dia] = true;
			console.log(dia + " " + checkAvailability(arr, dia));


		}
	}


	testaMaskEmSemana(mask) {

		var m = mask;
		var arrei;

    //começar com segunda e encerrar em domingo
    //Array.push() insere itens no final do array... e aí?

    if (m && 1) {
      arrei.push("seg");
    }

    if (m && 2) {
      arrei.push("ter");
    }

    if (m && 4) {
      arrei.push("qua");
    }

    if (m && 8) {
      arrei.push("qui");
    }

    if (m && 16) {
      arrei.push("sex");
    }

    if (m && 32) {
      arrei.push("sab");
    }

    if (m && 64) {
      arrei.push("dom");
    }

    console.log("testaMaskEmSemana()");
    console.log(arrei);
    return arrei;


	}




	enviaCheckbox(){ //e enviaProgs()... esqueci de mudar o nome.
			//testar flag
			this.global.flagComm = true;

		   //se "dias" contem algo --> mask eh atribuido um tal valor
		   //depois enviar { m: mask }
			//this.dias = this.global.getDias();

			//this.texto = " " + this.dias + " " ;  // retirei caracteres especiais - pode bugar
			//this.bluetoothSerial.write(this.texto);

			//preciso transformar isso (cuspido pelo Console.log):
			//  Checkbox data:
			//  Array [ "seg", "ter", "qua", "qui", "sex" ]

			//em máscara de bits... como eu tinha feito antes..

			//> sab = 01; sex = 02; qui = 04; qua = 08;
			//> ter = 16; seg = 32; dom = 64;
			//> variável 'mask' entre 0 e 127 --> 7 bits


			// I - transformar lista/array em tuplo/objeto/classe
			//já fiz lá em cima

			// II - verificar estado dos dias, em boolean
			// processar em doCheckbox()
			// já fiz...

			// III - somar valor referente a cada dia e guardar em this.mask
			//testar valores e somar...
			//depois <-----------

			//possivel conflito no estado inicial e ion-radio
			//usar alguma flag?
			this.maskaux = this.mask;
			this.mask = 0;


			//li a checkbitmask() no bluetooth_json_rev4.ino

			if (this.dias.seg == true){
				this.mask = this.mask + 1;
			}

			if (this.dias.ter == true){
				this.mask = this.mask + 2;
			}

			if (this.dias.qua == true){
				this.mask = this.mask + 4;
			}

			if (this.dias.qui == true){
				this.mask = this.mask + 8;
			}

			if (this.dias.sex == true){
				this.mask = this.mask + 16;
			}

			if (this.dias.sab == true){
				this.mask = this.mask + 32;
			}

			if (this.dias.dom == true){
				this.mask = this.mask + 64;
			}

			if(this.mask != this.maskaux ) { // Verificando se houve alteração de dados.
				this.alteroudados = true;
			}

			//this.global.putMask(this.mask);

		    //enviar e guardar global.mask
			//this.texto = " { \"m\": " + this.mask + " } ";
			//this.global.putMask(this.mask);
			this.enviaProgs();
			//console.log(this.texto);
			//this.bluetoothSerial.write(this.texto);


			//DEBUG apenas
			//depois mostra outro alerta com os dias?
			//this.mostrarDias();


			//testar carregamento de event sem ser periodico
			this.carregarEvent();

			//testar flag
			this.global.flagComm = false;

			//this.global.flagEvent = true;
	}


	//experimental
	enviaProgs(){	//executado a cada configuracao de dias ( {m : 127} )

		//precarrega valores... o setInterval original so tinha isso
		//this.carregarVars();

		//string JSON contendo mask e programacoes de horarios
		//global.pl1 ou pl1 ?
		this.pl1aux = this.event.PL1.replace(":", "");
		this.pl2aux = this.event.PL2.replace(":", "");
		this.pd1aux = this.event.PD1.replace(":", "");
		this.pd2aux = this.event.PD2.replace(":", "");
		this.texto = " \n { \"m\": " + this.mask + " , \"pl1\": \"" + this.pl1aux + "\" , \"pl2\": \"" + this.pl2aux + "\" , \"pd1\": \"" + this.pd1aux + "\" , \"pd2\": \"" + this.pd2aux + "\" } ";
		this.maskaux = this.mask;	
		//alert(" \n { \"m\": " + this.mask + " , \"pl1\": \"" + this.pl1aux + "\" , \"pl2\": \"" + this.pl2aux + "\" , \"pd1\": \"" + this.pd1aux + "\" , \"pd2\": \"" + this.pd2aux + "\" } ");
		//alert(this.texto); Testando se o texto esta correto.
		//enviar
		console.log(this.texto);
		this.bluetoothSerial.write(this.texto).then( (success) => { /*alert (success);*/} , (error) => { /*alert(error);*/}  );
		this.loader = this.loadingCtrl.create({
			content: "Aguarde enquanto o dispositivo processa seu comando...",
		  });
		this.loader.present();
		setTimeout( () => {
			if(this.alteroudados) {
				alert("Ocorreu um erro no envio/recebimento do dado.");
				this.loader.dismiss();
			}
			
		 } , 6000);

		//debug
		//carrega numeros tratados de global para event
		this.carregarEvent();

	}

	//--------------------------------------------------------------------
	//ultimo teste para consertar PL1 com hora < 10
	//realmente

	//event captura hora e minuto do picker e joga pra ca
	public event = { PL1: '06:00', PD1: '12:00', PL2: '13:00', PD2: '18:00' }


	Num2Hour(p) { //p = pl1, pl2, pd1, pd2 ...
		/*
		var n = parseFloat(p); //ou ParseFloat() ? ou parseInt()?
		//1243 --> 1243.0 = n
		//808  --> 808.0  = n

		var t = Math.trunc( n / 100);

		var h = t; //trunc ou round?
		//1243.0 --> 12.43 -> 12.00 -> 12 = h
		//808.0  -->  8.08 ->  8.00 ->  8 = h

		var a = h.toString();

		//testar pra hora de 1 digito

		if (a.length == 1){  //h = 8
			var b = "0" + a;
			return b; //colocar um zero antes, hehe
					  // b = 08 ?
		}

		if (a.length == 2){ //h=12
			return a;	// a = 12
		}

		//sem o teste
		//return h.toString();
		*/

		// FEITO POR LUCAS >>>>>>>>> PARA RESOLVER PROBLEMA COM 00:00 NAO LIDAREMOS COM NUMBER APENAS COM STRING'S
		if(p.length == 3) {
			//alert(p + "l=3 horas " + p[0]);
			return p[0];
		}
		else {
			//alert(p + "l=4 horas " + p[0] + "" + p[1])
			return p[0] + "" + p[1];
		}

	}

	Num2Min(p) { //p = pl1, pl2, pd1, pd2 ...
		/*
		var n = parseFloat(p); //ou ParseFloat() ? ou parseInt()?
		//1243 --> 1243.0 = n

		var t = Math.trunc( n / 100);

		var h = t; //trunc ou round?
		//1243.0 --> 12.43 -> 12.00 > 12 = h

		var d = n;
		//1243.0 --> 1243 = n

		var m = d - (h * 100) ;
		//1243 - 1200 = 43 = m

		if (m == 0) {
			return "00";
		} else {
			return m.toString();
		}
		*/
		if(p.length == 3) {
			//alert(p + "l=3 minutos " + p[1] + "" + p[2]);
			return p[1] + "" + p[2];
		}
		else {
			//alert(p + "l=4 minutos " +p[2] + "" + p[3]);
			return p[2] + "" + p[3];
		}
	}

	//implementar um flagEvent aqui...
	//o global.pd s & .pl s estão sendo sobreescritos a cada setInterval...
	//o que pode bugar se o valor for menor que 500 milissegundos

	numerosTratados(){
		this.a1 = this.Num2Hour(this.pl1);
		this.a2 = this.Num2Min (this.pl1);
		//alert("a1 " + this.a1 + "a2 " + this.a2);
		this.b1 = this.Num2Hour(this.pd1);
		this.b2 = this.Num2Min (this.pd1);

		this.c1 = this.Num2Hour(this.pl2);
		this.c2 = this.Num2Min (this.pl2);

		this.d1 = this.Num2Hour(this.pd2);
		this.d2 = this.Num2Min (this.pd2);
	}


	carregarEvent(){
		//carrega numeros tratados de global para event
		this.event.PL1 	= this.a1 + ":" + this.a2;
		this.event.PD1	= this.b1 + ":" + this.b2;
		this.event.PL2	= this.c1 + ":" + this.c2;
		this.event.PD2	= this.d1 + ":" + this.d2;

	}





	//-------


	//-------------------------

	mostrarDias() {

		this.dias = this.global.getDias();

		let alert = this.alertCtrl.create({
			title: 'Debug: "this.dias" = ?',
			subTitle: "Na verdade... ele é também é uma variável global...\n" + JSON.stringify(this.dias),
			buttons: ['Beleza']
		});
		alert.present();
	}

	//https://stackoverflow.com/questions/4215737/convert-array-to-object


}




