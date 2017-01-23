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
  game.load.spritesheet('enemy', '../assets/soldier2.png', 32, 32)
}

var socket;

var cursors;

var platforms;
var ground;
var landingPlatform;

var choppa;

var soldier1;
var enemy;

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
  var duplicate = enemy;
  if (duplicate) {
    console.log('Duplicate player!')
    return
  }

  // Add new player to the remote players array
  enemy = new RemotePlayer(data.id, game, soldier1, data.x, data.y)
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
  soldier1.body.velocity.x = 0;

  if (cursors.left.isDown) {
    soldier1.body.velocity.x = -75;
    soldier1.animations.play('left');
  }
  else if (cursors.right.isDown) {
    soldier1.body.velocity.x = 75;
    soldier1.animations.play('right')
  }
  else {
    soldier1.animations.stop(true);
    soldier1.frame = 4
  }

  if (cursors.up.isDown && soldier1.body.touching.down) {
    console.log(cursors.up);
    soldier1.body.velocity.y = -350;
  }

}
