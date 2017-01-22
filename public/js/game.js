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
}

var player;
var platforms;
// var ground;
var landingPlatform;
var cursors;
var choppa;

function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  var sky = game.add.sprite(0, 0, 'sky')
  sky.scale.setTo(width, percentage(height, 0.2))

  // game.stage.backgroundColor = "#29DEF7";
  game.add.sprite(20, 20, 'sun');

  platforms = game.add.group();
  platforms.enableBody = true;

  var ground = platforms.create(0, height - 64, 'ground')
  ground.scale.setTo(width, height);
  ground.body.immovable = true;

  landingPlatform = platforms.create(percentage(width, 37), percentage(height, 15), 'ground');
  landingPlatform.body.immovable = true;

  choppa = game.add.sprite(percentage(width, 44), percentage(height, 4), 'choppa');
  game.physics.arcade.enable(choppa);
  choppa.body.gravity.y = 100;
  choppa.body.collideWorldBounds = true;

  // game.physics.arcade.enable(player);

  // player.body.bounce.y = 0.2;
  // player.body.gravity = 300;
  // player.body.collideWorldBounds = true;

  cursors = game.input.keyboard.createCursorKeys();
}

function update() {

  game.physics.arcade.collide(choppa, platforms);
  //
  // if (cursors.left.isDown) {
  //   player.body.velocity.x = -150;
  //   player.animations.play('left');
  // }
  // else if (cursors.right.isDown) {
  //   player.body.velocity.x = 150;
  //   player.animations.play('right')
  // }
  // else {
  //   player.animations.stop();
  //   player.frame = 4
  // }
  //
  // if (cursors.up.isDown && player.body.touching.down) {
  //   player.body.velocity.y = -350;
  // }

}
