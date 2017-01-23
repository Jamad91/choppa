var path = require('path')

var http = require('http')
var server = http.createServer();

var express = require('express');
var app = express();

var socketio = require('socket.io');

server.on('request', app);

var io = socketio(server);

io.on('connection', function (socket) {
  // Called when the client calls socket.emit('move')
  // socket.on('move', function(msg) {
  //   socket.broadcast.emit('move', msg);
  // });
  // socket.on('message', function (message) {
  //   console.log(`Got message from client: ${message}`);
  // })
});

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(1337, function () {
  console.log('The server is listening on port 1337!');
});
