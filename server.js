var path = require('path')

var http = require('http')
var server = http.createServer();

var express = require('express');
var app = express();

var socketio = require('socket.io');

server.on('request', app);

var io = socketio(server);

io.on('connection', function (socket) {
  console.log('SEE THE SOCKET');
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});


app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(1337, function () {
  console.log('The server is listening on port 1337!');
});
