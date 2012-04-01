var io = require('socket.io-client');
var socket = io.connect('http://192.168.1.4');
socket.on('connect', function () {
  // socket connected
  console.log('connected');
setInterval(chatter,1000);
});
socket.on('user connected', function (data) {
  // server emitted a custom event
    console.log('event' + data.msg);
});
socket.on('disconnect', function () {
  // socket disconnected
    console.log('disconnected');
});
var n = 0;
function chatter(){
  ++n;
  //console.log('chat #' + n);
  socket.emit('myevent', {msg:'hi there mike from James chat #' + n});
};


