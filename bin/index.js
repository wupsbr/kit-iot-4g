#!/usr/bin/env node

var kitiot  = require('../lib/kit-iot'),
    Insight = require('insight'),
    pkg     = require('../package.json'),
    token   = require('../lib/token'),

    argv    = require('minimist')(process.argv.slice(2)),
    insight = new Insight({
        trackingCode  : 'UA-5427757-50',
        packageName   : pkg.name,
        packageVersion: pkg.version
    }),
    args    = process.argv,
    isConsole = false;

//Check if we want to use the console mode ...
isConsole = argv.setup || argv.console;

//Check for console setup ...
if (argv.setup) {
  isConsole = true;
  if (!argv.name || !argv.username || !argv.password || !argv.email || !argv.tel || !argv.apikey || !argv.token)
  {
    console.log("Erro! os seguintes parametros sao necessarios:");
    console.log("  --name");
    console.log("  --password");
    console.log("  --email");
    console.log("  --tel");
    console.log("  --apikey");
    console.log("  --token");
    console.log("Exemplo:");
    console.log("kit-iot-4g --setup --name=Seu Nome --username=cprecifeA_b --password=0123 --email=a@a.com --tel=123 --apikey=a012b024 --token=0123");
    return ;
  } else {
    t.saveConfig({
      "name":     argv.name,
      "usuario":  argv.username,
      "password": argv.password,
      "email":    argv.email,
      "tel":      argv.tel,
      "apikey":   argv.apikey,
      "token":    argv.token
    });
  }
}

// //Initiate the kit
// if (args[2] && args[2] === '-c') {
//   isConsole = true;
// }

var KitIoT = new kitiot(isConsole);
insight.track('init');

//If is not console start the io connection
if (!KitIoT.isConsole) {
  //On io connection start the arduino
  KitIoT.io.on('connection', function (socket) {
    KitIoT.connect();
    insight.track('socket', 'connection');

    KitIoT.start();

    //Start sending/saving data
    socket.on('start', function () {
      if (!KitIoT.token.getToken()) {
        KitIoT.logout();

      } else {
        KitIoT.start();
        insight.track('socket', 'start');
      }
    });

    //Stop sending/saving data
    socket.on('stop', function () {
      KitIoT.clearLoop(KitIoT.loop);
      insight.track('socket', 'stop');
    });
  });
}
