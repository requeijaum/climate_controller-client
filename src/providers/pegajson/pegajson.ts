import { Injectable } from "@angular/core";
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
//import { AlertController } from 'ionic-angular';

@Injectable()
export class PegadorJSON {
    
    constructor(    
        public  bluetoothSerial:        BluetoothSerial,    
        //public  alert:                  AlertController
    )
    
    {
        
        this.valor_seguro   = 13;  //precisamos saber qual a faixa de valor seguro para tamanho da string!!!
        this.JSONpeguei     = {};
        this.dados          = ""
    }

    public valor_seguro:        number;    
    public JSONpeguei  :        any;
    public dados:               string;

    async pegaJSON(){
        await this.bluetoothSerial.readUntil("}")     //se não houver delimitador contido no buffer... retornará vazio!
        .then(
            (data) => (this.dados = data) , () => (console.log("Erro!"))
        )
        .then( () => {
            if (this.dados.length > this.valor_seguro) { 
                this.JSONpeguei = JSON.parse(this.dados);
            }
        } , () => (console.log("Erro no pegaJSON!")))
        //.catch( () => this.bluetoothSerial.write("Ocorreu algum erro no pegaJSON()") )
    
        //não acho legal jogar data direto em global... prefiro mandar parsear direto e retornar pela função
        return JSON.parse(this.JSONpeguei);
    }
    
    

}


