var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update})
var platforms;
var player;
var cursors;

function preload() {
  game.load.image('sky', '../assets/sky.png');
  game.load.image('ground', '../assets/ground.png');
  game.load.spritesheet('player', '../assets/soldier1.png', 32, 32)
  game.load.spritesheet('enemy', '../assets/soldier3.png', 32, 32)
}

let enemies = []


function create() {
  socket = io.connect()

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.sprite(0,0,'sky');
  platforms = game.add.group();
  platforms.enableBody = true;
  var ground = platforms.create(0, game.world.height - 64, 'ground');
  ground.scale.setTo(2,2);
  ground.body.immovable = true;
  var ledge = platforms.create(400, 400, 'ground');

  ledge.body.immovable = true;

  ledge = platforms.create(-150, 250, 'ground')

  ledge.body.immovable = true

  player = game.add.sprite(32, game.world.height - 150, 'player')


  game.physics.arcade.enable(player);

  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  //  Our two animations, walking left and right.
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

  setEventHandlers()
}

var setEventHandlers = function () {
  // Socket connection successful
  socket.on('connect', onSocketConnected)

  // Socket disconnection
  socket.on('disconnect', onSocketDisconnect)
  //
  // // New player message received
  socket.on('new player', onNewPlayer)
  //
  // // Player move message received
  // socket.on('move player', onMovePlayer)
  //
  // // Player removed message received
  // socket.on('remove player', onRemovePlayer)
}

function onSocketConnected () {
  console.log('Connected to socket server')
  console.log('Socket id', socket.id);

  enemies.forEach(enemy => enemy.player.kill())
  enemies = [];
  socket.emit('new player', {x: player.x, y: player.y})
}

function onSocketDisconnect () {
  console.log('Disconnected from socket server')
  console.log('Socket id', socket.id);
}

function onNewPlayer (data) {
  console.log('data data', data);
  // var duplicate = playerById(data.id)
  // if (duplicate) {
  //   console.log('Duplicate player!')
  //   return
  // }
  enemies.push(new RemotePlayer(data.id, game, player, data.x, data.y, data.angle))
}

function onMovePlayer(data) {
  // console.log('moving game data', data)
  // socket.emit('move player')
}


function update() {
  var hitPlatform = game.physics.arcade.collide(player, platforms);
  cursors = game.input.keyboard.createCursorKeys();


  player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
        // onMovePlayer(player)
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
        // onMovePlayer(player)
        // socket.emit('move player')
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -350;
    }
}
