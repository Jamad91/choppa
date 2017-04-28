// const width = window.innerWidth;
// const height = window.innerHeight;
//
// function percentage(side, percent) {
//   return (side * percent) / 100
// }
//
// var game = new Phaser.Game(width, height, Phaser.AUTO, '', {preload: preload, create: create, update: update});
//
// function preload() {
//   // game.load.image('sky', '../assets/sky.png')
//   // game.load.image('sun', '../assets/sun.png');
//   // game.load.image('ground', '../assets/ground.png');
//   // game.load.spritesheet('choppa', '../assets/choppa.png', 180, 90);
//   game.load.spritesheet('player','../assets/soldier1.png', 32, 32);
//   // game.load.spritesheet('enemy', '../assets/soldier3.png', 32, 32)
// }
//
// var cursors;
//
// var platforms;
// var ground;
// var landingPlatform;
// var ledge;
//
// var choppa;
//
// var player;
//
// function create () {
//   socket = io();
//
//   game.physics.startSystem(Phaser.Physics.ARCADE);
//   // var sky = game.add.sprite(0, 0, 'sky')
//   // sky.scale.setTo(width, percentage(height, 0.2))
//   //
//   // game.add.sprite(20, 20, 'sun');
//   //
//   // platforms = game.add.group();
//   // platforms.enableBody = true;
//   //
//   // ground = platforms.create(0, height - 64, 'ground')
//   // ground.scale.setTo(width, height);
//   // ground.body.immovable = true;
//   //
//   player = game.add.sprite(percentage(width, 50), percentage(height, 80) + 1, 'player');
//   game.physics.arcade.enable(player);
//   // player.body.gravity.y = 100;
//   // player.body.collideWorldBounds = true;
//   //
//   // player.scale.setTo(1.5, 1.5)
//   //
//   // player.animations.add('right', [4,5], 10, true);
//   // player.animations.add('left', [2,3], 10, true);
//   //
//   cursors = game.input.keyboard.createCursorKeys();
// }
//
//
// function update() {
//   // game.physics.arcade.collide(choppa, platforms);
//   // game.physics.arcade.collide(player, platforms);
//   //
//   // player.body.velocity.x = 0;
//   //
//   if (cursors.left.isDown) {
//     player.body.velocity.x = -175;
//     player.animations.play('left');
//   }
//   else if (cursors.right.isDown) {
//     player.body.velocity.x = 175;
//     player.animations.play('right')
//   }
//   else {
//     player.animations.stop(true);
//     player.body.velocity.x = 0;
//     player.frame = 4
//   }
// }

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update})
var platforms;
var player;
var cursors;

function preload() {
  game.load.image('sky', '../assets/sky.png');
  game.load.image('ground', '../assets/ground.png');
  game.load.spritesheet('player', '../assets/soldier1.png', 32, 32)
}


function create() {
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
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
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
