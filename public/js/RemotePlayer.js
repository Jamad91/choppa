/* global game */

var RemotePlayer = function (index, game, player, startX, startY) {
  var x = startX
  var y = startY

  this.game = game
  this.player = player

  this.player = game.add.sprite(x, y, 'enemy')

  this.player.animations.add('right', [4,5], 10, true);
  this.player.animations.add('left', [2,3], 10, true);
  this.player.animations.add('stop', [3], 20, true)

  this.player.anchor.setTo(0.5, 0.5)

  this.player.name = index.toString()
  game.physics.enable(this.player, Phaser.Physics.ARCADE)
  this.player.body.immovable = true
  this.player.body.collideWorldBounds = true

  this.lastPosition = { x: x, y: y }
}

RemotePlayer.prototype.update = function () {
  if (this.player.x !== this.lastPosition.x || this.player.y !== this.lastPosition.y) {
    this.player.play('move')
  } else {
    this.player.play('stop')
  }

  this.lastPosition.x = this.player.x
  this.lastPosition.y = this.player.y
}

window.RemotePlayer = RemotePlayer
