var path = require('path');
var http = require('http');
var server = http.createServer();
var express = require('express');
var app = express();
// var io = require('socket.io');
//
// var Player = require('./lib/Player');

// var socket;
// var players;

server.on('request', app);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(1337, function () {
  console.log('The server is listening on port 1337!');
  // init();
});

// function init() {
//   players = [];
//   socket = io.listen(server);
//   setEventHandlers();
// }
//
// function setEventHandlers() {
//   socket.sockets.on('connection', onSocketConnection);
// }
//
// function onSocketConnection(client) {
//   console.log(`New player has connected: ${client.id}` );
//   client.on('disconnect', onClientDisconnect);
//   client.on('new player', onNewPlayer(client));
//   client.on('move player', onMovePlayer);
//   console.log('Total number of players', players.length);
// }
//
// function onClientDisconnect() {
//   console.log(`Player ${this.id} has disconnected`);
//   var removePlayer = playerById(this.id);
//
//   if(!removePlayer) {
//     console.log(`Player ${this.id} not found`);
//     return
//   }
//
//   players.splice(players.indexOf(removePlayer), 1);
//
//   this.broadcast.emit('removePlayer', {id: this.id});
// };
//
// function onNewPlayer(data) {
//   var newPlayer = new Player(data.x, data.y);
//   newPlayer.id = this.id;
//
//   console.log('gooseling', this.id);
//
//   this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});
//
//   var i, existingPlayer;
//
//   for (i = 0; i < players.length; i++) {
//     existingPlayer = players[i];
//     this.emit('new player', {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
//   }
//   console.log('New Player info', newPlayer);
//   players.push(newPlayer);
//   console.log('All Players', players);
// }
//
// function onMovePlayer(data) {
//   var movePlayer = playerById(this.id);
//
//   if(!movePlayer) {
//     console.log(`Player ${this.id} not found`);
//     return
//   }
//
//   movePlayer.setX(data.x);
//   movePlayer.setY(data.y);
//
//   this.broadcast.emit('move player', {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
// }
//
// function playerById(id) {
//   for (var i = 0; i < players.length; i++) {
//     if (players[i].id === id) {
//       return players[i]
//     }
//   }
//   return false
// }
