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
  game.load.spritesheet('player','../assets/soldier1.png', 32, 32);
  game.load.spritesheet('enemy', '../assets/soldier3.png', 32, 32)
}

var cursors;

var platforms;
var ground;
var landingPlatform;
var ledge;

var choppa;

var player;

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

  player = game.add.sprite(percentage(width, 50), percentage(height, 80) + 1, 'player');
  game.physics.arcade.enable(player);
  player.body.gravity.y = 100;
  player.body.collideWorldBounds = true;

  player.scale.setTo(1.5, 1.5)

  player.animations.add('right', [4,5], 10, true);
  player.animations.add('left', [2,3], 10, true);
 })

  keys = game.input.keyboard.createCursorKeys();
}


function update() {
  game.physics.arcade.collide(choppa, platforms);
  game.physics.arcade.collide(player, platforms);

  player.body.velocity.x = 0;

  if (cursors.left.isDown) {
    player.body.velocity.x = -175;
    player.animations.play('left');
  }
  else if (cursors.right.isDown) {
    player.body.velocity.x = 175;
    player.animations.play('right')
  }
  else {
    player.animations.stop(true);
    player.frame = 4
  }

}
