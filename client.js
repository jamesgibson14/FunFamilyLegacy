
var io = require('socket.io-client');

var socket = io.connect('http://71.195.221.2:2390');

socket.on('connect', function () {
  // socket connected
  console.log('socket connected');
  setInterval(autochatter,1500)
});
socket.on('user connected', function (data) {
  // server emitted a custom event
   console.log('socket customevent' + data);
});
socket.on('disconnect', function () {
  // socket disconnected
   console.log('socket disconnected');
});
 console.log('sending chat');
socket.emit('myevent', {my: 'data'});
var n = 0;
function autochatter (){

++n;
//console.log('chat #' + n);
socket.emit('myevent', {text: 'hi there Mike from James #' + n});
}

