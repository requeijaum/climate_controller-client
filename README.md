# climate_controller-client

Cliente de um protótipo de climatizador. Projeto iniciado enquanto eu estagiava no Hospital Martagão Gesteira, em 2017.

Feito com Ionic 3 e Cordova.

----

## Iniciando

Inicie um projeto em branco com o Ionic CLI e dê um ```git fetch; git pull``` dentro da pasta do projeto.


### Plugins do Cordova

>https://github.com/don/BluetoothSerial

```bash
cordova plugin add cordova-plugin-bluetooth-serial
```

### Build para Android

Deixei um script pronto - necessita do ambiente Android Studio e uma SDK com API Level >= 16.

```bash
./build.sh --prod
```

----

### Buildando o apk pelo terminal

Na hora de buildar o apk ou testar o aplicativo com ionic serve, caso dê incompatibilidade com a arquitetura de seu computador atual rode os seguintes
comandos no terminal:

```bash
npm uninstall --save node-sass
```


## Contribuindo

### Não autorizo ninguém a utilizar esse código - apenas visualizá-lo.
Por enquanto, como não disponibilizei licença: qualquer utilização, reprodução ou edição desse código, **sem sua devida autorização**, está expressamente *PROIBIDA*.


----

## Agradecimentos

* Obrigado StackOverflow - por existir
* Obrigado Victor Ben-Hur pela oportunidade e pelo desafio de testar meus conhecimentos.
* Obrigado Lucas Borges pelas novas ideias para otimização.
