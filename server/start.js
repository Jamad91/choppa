'use strict'

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const {resolve} = require('path')
const passport = require('passport')
const PrettyError = require('pretty-error')
const finalHandler = require('finalhandler')
const app = express()
const io = require('socket.io')
const pkg = require('APP')
const Player = require('./Player')

let socket;
let players;


if (!pkg.isProduction && !pkg.isTesting) {
  app.use(require('volleyball'))
}

const prettyError = new PrettyError();

prettyError.skipNodeFiles()

prettyError.skipPackage('express')

module.exports = app
  .use(require('cookie-session') ({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'an insecure secret key'],
  }))

  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())

  .use(passport.initialize())
  .use(passport.session())

  .use(express.static(resolve(__dirname, '..', 'public')))

  .use('/api', require('./api'))

  .use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found')
      err.status = 404
      next(err)
    } else {
      next()
    }
  })

  .get('/*', (_, res) => res.sendFile(resolve(__dirname, '..', 'public', 'index.html')))

  .use((err, req, res, next) => {
    console.error(prettyError.render(err))
    finalHandler(req, res)(err)
  })


if (module === require.main) {
  const server = app.listen(
    process.env.PORT || 1337,
    () => {
      console.log(`--- Started HTTP Server for ${pkg.name} ---`)
      const { address, port } = server.address()
      const host = address === '::' ? 'localhost' : address
      const urlSafeHost = host.includes(':') ? `[${host}]` : host
      console.log(`Listening on http://${urlSafeHost}:${port}`)
      init()
    }
  )

  function init() {
    players = [];
    socket = io(server);
    setEventHandlers();
  }

  function setEventHandlers() {
    socket.sockets.on('connection', onSocketConnection)
  }

  function onSocketConnection(client) {
    console.log('New Player has connected:', client.id)
    client.on('disconnect', onClientDisconnect)
    client.on('new player', onNewPlayer)
    client.on('move player', onMovePlayer)
    console.log('hitting');
  }

  function onClientDisconnect () {
    console.log('Player has disconnected: ' + this.id)
    players.splice(players.indexOf(this.id), 1)
    this.broadcast.emit('remove player', {id: this.id})
    console.log("Current number of players: ", players.length);
  }

  function onNewPlayer (data) {
    var newPlayer = new Player(data.x, data.y)
    newPlayer.id = this.id
    this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})

    var i, existingPlayer
    for (i = 0; i < players.length; i++) {
      existingPlayer = players[i]
      this.emit('new player', {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()})
    }

    players.push(newPlayer)
  }

  function onMovePlayer(data) {
    var movePlayer = playerById(this.id)
    console.log('THIS', Object.keys(this));
    console.log('X location',movePlayer);

    movePlayer.setX(data.x)
    movePlayer.setY(data.y)

    this.broadcast.emit('move player', {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()})

  }

}

function playerById (id) {
  var i
  for (i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i]
    }
  }

  return false
}
