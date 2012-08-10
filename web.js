var express = require('express');
var chat = require('./controllers/chat.js');
var io = require('socket.io-client');
var socket = io.connect('174.52.250.244:2390');
var app = express.createServer(express.logger());

app.configure(function () {
  app.use(express.logger());
  app.use(express.static(__dirname + '/lib'));
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.methodOverride());
});

app.configure('development', function () {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack:true
  }));
});
app.configure('production', function () {
  app.use(express.errorHandler());
});

app.set('views', __dirname + '/views');

app.set('view options', { layout: false });

app.register('.html', {
  compile: function(str, options){
    return function(locals){
      return str;
    };
  }
});

app.get('/', function(req, res) {
  res.render('index.html');
});

function error(err, data) {
  console.log("ERROR: " + err);
  console.log("DATA: " + data);
}

app.get('/ws/chat', function(req, res) {
  chat.get(function (chats) {
    res.send(chats);
  }, error);
  
});

app.post('/ws/chat', function(req, res) {
  chat.add(req.body, function (chat) {
    res.send(chat);
	socket.emit('myevent', chat);
  }, error);
});

app.put('/ws/chat/:id', function(req, res) {
  chat.save(req.params.id, req.body, function (chat) {
    res.send(chat);
  }, error);
});

app.del('/ws/chat/:id', function(req, res) {
  chat.remove(req.params.id, function () {
    res.send();
  }, error);
});
socket.on('connect', function () {
  // socket connected
  console.log('socket connected');
socket.emit('myevent', {msg: 'mike is connected' });
});
socket.on('user connected', function (data,res,req) {
  // server emitted a custom event
   console.log('socket customevent');
   chat.add(data, function (chat) {
    //res.send(chat); //here I need to be able to send something back to the client, either with long-polling or websockets
  }, error);
});
var port = 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
