/* global game */

var enemyCursors

var RemotePlayer = function (index, game, player, startX, startY) {
  var x = startX
  var y = startY

  this.game = game
  this.player = player
  this.alive = true
  var platforms = this.game.world.children[2]
  // console.log('ENEMY PLATFORMS', platforms);
  // console.log('MAYBE', this.platforms);

  console.log('ENEMY', this.player);
  this.player = game.add.sprite(x, y, 'enemy')

  this.player.scale.setTo(1.5, 1.5);
  game.physics.enable(this.player, Phaser.Physics.ARCADE)

  this.player.body.gravity.y = 100;
  this.player.body.collideWorldBounds = true

  this.player.animations.add('left', [2,3], 10, true);
  this.player.animations.add('right', [5,4], 10, true);
  this.player.animations.add('stop', [3], 20, true);

  this.player.name = index.toString()

  enemyCursors = game.input.keyboard.createCursorKeys();

  // console.log(this.player.body);
}

RemotePlayer.prototype.update = function () {
  this.player.body.velocity.x = 0;
  this.game.physics.arcade.collide(this.player, platforms)
}

window.RemotePlayer = RemotePlayer
