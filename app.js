var express = require('express');
var http = require('http');
var config = require('./config');
var mongo = require('./routes/mongo');

var app = express();

// all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

console.log('environment: ' + app.get('env'));

app.use(express.static(__dirname + config.staticDir));

if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/settings.js', function(req, res) {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', 0);

  res.send('window.settings = ' + JSON.stringify(config.settings) + ';');
});

app.get('/data', mongo.data);
app.get('/all', mongo.all);
app.get('/topn', mongo.topn);

http.createServer(app).listen(config.port, function(){
    console.log('Express server listening on port ' + config.port);
});