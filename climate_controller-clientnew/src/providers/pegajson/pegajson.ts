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
        
        this.valor_seguro   = 64;  //precisamos saber qual a faixa de valor seguro para tamanho da string!!!
        this.JSONpeguei     = {};
        this.dados          = "";
        

    }

    public valor_seguro:        number;    
    public JSONpeguei  :        any;
    public dados:               string;
    

    ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint16Array(buf)); //acho melhor usar Uint8Array...
      }
    
    str2ab(str) {
        var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var i=0, strLen=str.length; i < strLen; i++) {
          bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }
    

    async pegaJSON(){
        await this.bluetoothSerial.subscribeRawData().subscribe(
        async data => {
            async (data) => (this.dados = this.ab2str(data)) 
            if (this.dados.length > this.valor_seguro) { 
                this.JSONpeguei = await JSON.parse(this.dados);
            }
        }
        )
        return this.dados
    }

}


