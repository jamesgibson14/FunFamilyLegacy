var io = require('socket.io').listen(80);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('myevent', function (data) {
    console.log(data);
	socket.broadcast.emit('user connected',data);
  });
  
});