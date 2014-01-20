var express = require('express');
var sockjs  = require('sockjs');
var http = require('http');
var config = require('./config');

var app = express();

// all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

console.log('environment: ' + app.get('env'));

if ('production' == app.get('env')) {
    app.use(express.static(__dirname + '/dist'));
} else if ('development' == app.get('env')) {
    app.use(express.static(__dirname + '/app'));
    app.use(express.errorHandler());
}

app.get('/settings.js', function(req, res) {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', 0);

  res.send('window.settings = ' + JSON.stringify(config.settings) + ';');
});

var clients = {};
var clientCount = 0;
var interval;

function createBroadcast(topic) {
  var randomValue = 0;

  function nextValue (value) {
    value += Math.random() * 5;
    value = value < 0 ? 0 : value > 100 ? 0 : value;
    return value;
  }

  function broadcast() {
    randomValue = nextValue(randomValue);
      var data = { value: randomValue };
      var msgObject = { topic: topic, data: data};
      var msg = JSON.stringify(msgObject);

      for (var key in clients) {
          if(clients.hasOwnProperty(key)) {
              clients[key].write(msg);
          }
      }
  }

  return broadcast;
}

var broadcast1 = createBroadcast('randomValue');
var broadcast2 = createBroadcast('randomValue2');

function broadcast() {
  broadcast1();
  broadcast2();
}

function startBroadcast () {
    interval = setInterval(broadcast, 1000);
}

var sockjsServer = sockjs.createServer();

sockjsServer.on('connection', function(conn) {
    clientCount++;
    if (clientCount === 1) {
        startBroadcast();
    }

    clients[conn.id] = conn;

    conn.on('close', function() {
        clientCount--;
        delete clients[conn.id];
        if (clientCount === 0) {
            clearInterval(interval);
        }
    });
});

var server = http.createServer(app).listen(config.port, function(){
    console.log('Express server listening on port ' + config.port);
});

sockjsServer.installHandlers(server, { prefix: '/sockjs' });