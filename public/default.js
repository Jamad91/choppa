var socket = io();

// called when a player makes a move on the board UI
var handleMove = function (source, target) {
  var move = game.move({from: source, to: target});
  socket.emit('move', move);
  // called when the server calls socket.broadcast('move')
  socket.on('move', function (msg) {
    game.move(msg);
    board.position(game.fen()); // fen is the board layout
  });
}


msgButton.onclick = function(e) {
  socket.emit('message', 'hi tiara!');
}
