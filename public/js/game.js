const width = window.innerWidth;
const height = window.innerHeight;

function percentage(side, percent) {
  return (side * percent) / 100
}

var game = new Phaser.Game(width, height, Phaser.AUTO, '', {preload: preload, create: create, update: update});

function preload() {
  game.load.image('sky', '../assets/sky.png')
  game.load.image('sun', '../assets/sun.png');
  game.load.image('ground', '../assets/ground.png');
  game.load.spritesheet('choppa', '../assets/choppa.png', 180, 90);
  game.load.spritesheet('soldier1','../assets/soldier1.png', 32, 32);
  game.load.spritesheet('enemy', '../assets/soldier3.png', 32, 32)
}

var socket;

var cursors;

var platforms;
var ground;
var landingPlatform;
var ledge;

var choppa;

var soldier1;
var enemy;

var winner;
console.log(winner);
var winnerName;
var winnerText;

function create () {
  socket = io();

  game.physics.startSystem(Phaser.Physics.ARCADE);
  var sky = game.add.sprite(0, 0, 'sky')
  sky.scale.setTo(width, percentage(height, 0.2))

  game.add.sprite(20, 20, 'sun');

  platforms = game.add.group();
  platforms.enableBody = true;

  ground = platforms.create(0, height - 64, 'ground')
  ground.scale.setTo(width, height);
  ground.body.immovable = true;

  ledge = platforms.create(percentage(width, -10), height / 2, 'ground')
  ledge.body.immovable = true;

  ledge = platforms.create(percentage(width, 80), height / 2, 'ground')
  ledge.body.immovable = true;

  ledge = platforms.create(percentage(width, 4), percentage(height, 20), 'ground')
  ledge.body.immovable = true;

  ledge = platforms.create(percentage(width, 70), percentage(height, 20), 'ground')
  ledge.body.immovable = true;

  ledge = platforms.create(percentage(width, 37), percentage(height, 70), 'ground')
  ledge.body.immovable = true;

  landingPlatform = platforms.create(percentage(width, 37), percentage(height, 15), 'ground');
  landingPlatform.body.immovable = true;

  choppa = game.add.sprite(percentage(width, 44), percentage(height, 4), 'choppa');
  game.physics.arcade.enable(choppa);
  choppa.body.gravity.y = 100;
  choppa.body.collideWorldBounds = true;

  soldier1 = game.add.sprite(percentage(width, 5), percentage(height, 80) + 1, 'soldier1');
  game.physics.arcade.enable(soldier1);
  soldier1.body.gravity.y = 100;
  soldier1.body.collideWorldBounds = true;

  soldier1.scale.setTo(1.5, 1.5)

  soldier1.animations.add('right', [4,5], 10, true);
  soldier1.animations.add('left', [2,3], 10, true);

  scoreText = game.add.text(percentage(width, 15), percentage(height, 40), "", { font: '70px Arial Bold', fill:'#000' })

  cursors = game.input.keyboard.createCursorKeys();

  setEventHandlers()
}

var setEventHandlers = function () {
  // Socket connection successful
  socket.on('connect', onSocketConnected)

  // Socket disconnection
  socket.on('disconnect', onSocketDisconnect)

  // New player message received
  socket.on('new player', onNewPlayer)

  // Player move message received
  socket.on('move player', onMovePlayer)

  // Player removed message received
  socket.on('remove player', onRemovePlayer)
}

// Socket connected
function onSocketConnected () {
  console.log('Connected to socket server')

  // Reset enemies on reconnect
  var enemy = null

  // Send local player data to the game server
  socket.emit('new player', { x: soldier1.x, y: soldier1.y })
}

// Socket disconnected
function onSocketDisconnect () {
  console.log('Disconnected from socket server')
}

// New player
function onNewPlayer (data) {
  console.log('New player connected:', data.id)

  // Avoid possible duplicate players
  // var duplicate = enemy;
  // if (duplicate) {
  //   console.log('Duplicate player!')
  //   return
  // }

  // Add new player to the remote players array
  enemy = new RemotePlayer(data.id, game, soldier1, percentage(width, 95), percentage(height, 80) + 1)

}

// Move player
function onMovePlayer (data) {
  var movePlayer = enemy

  // Player not found
  if (!movePlayer) {
    console.log('Player not found: ', data.id)
    return
  }

  // Update player position
  movePlayer.soldier1.x = data.x
  movePlayer.soldier1.y = data.y
}

// Remove player
function onRemovePlayer (data) {

  // Player not found
  if (!removePlayer) {
    console.log('Player not found: ', data.id)
    return
  }

  enemy.kill()

  enemy = null
}

function update() {
  game.physics.arcade.collide(choppa, platforms);
  game.physics.arcade.collide(soldier1, platforms);
  if (enemy) {
    enemy.update()
    game.physics.arcade.collide(enemy.player, platforms);
  }

  soldier1.body.velocity.x = 0;

  if (cursors.left.isDown) {
    soldier1.body.velocity.x = -175;
    soldier1.animations.play('left');
  }
  else if (cursors.right.isDown) {
    soldier1.body.velocity.x = 175;
    soldier1.animations.play('right')
  }
  else {
    soldier1.animations.stop(true);
    soldier1.frame = 4
  }

  console.log('HERO touchdown', soldier1.body.touching.down);
  if (cursors.up.isDown && soldier1.body.touching.down) {
    soldier1.body.velocity.y = -350;
  }

  console.log('X coordinates', soldier1.x);
  console.log('Y coordinates', soldier1.y);

  if(soldier1.x > 650 && soldier1.x < 770 && soldier1.y < 75) {
    winner = 'PLAYER 1'
  }
  else if (enemy && enemy.x > 650 && enemy.x < 770 && enemy.y < 75) {
    winner = 'PLAYER 2'
  }

  if(winner) {

    scoreText.text = `${winner} GOT TO DA CHOPPA!`
    console.log(scoreText.text);
  }

}
