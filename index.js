var kitiot  = require('./lib/kit-iot'),
    Insight = require('insight'),
    pkg     = require('./package.json'),
    argv    = require('minimist')(process.argv.slice(2)),
    insight = new Insight({
        trackingCode  : 'UA-XXXXXXX-XX',
        packageName   : pkg.name,
        packageVersion: pkg.version
    }),
    args    = process.argv,
    isConsole = false;

//Initiate the kit
if (args[2] && args[2] === '-c') {
  isConsole = true;
}

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
