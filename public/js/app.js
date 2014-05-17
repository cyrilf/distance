// This file relies on ./game files

var socket = io.connect(util.ADDRESS);
game.socket = socket;

/**
 * newRoomCallback is a callback function when a new room has been successfully created
 * @param  {String} roomId Unique roomId
 */
var newRoomCallback = function(err, roomId) {
  var roomURL = util.ADDRESS + ':' + util.PORT + '/' + roomId;

  // We display the url
  var gameLinks = document.getElementsByClassName('gameLink');
  for(var i = 0, l = gameLinks.length; i < l; i++) {
    gameLinks[i].setAttribute('href', 'http://' + roomURL);
    gameLinks[i].innerHTML = ' ' + roomURL;
  }

  socket.on('user:new', function(socketId, cb) {
    var newPlayer = new Player(socketId);

    var isFirstUser = playerManager.players.length === 0;
    if(isFirstUser) {
      game.initUI();
      game.runLoop();
    }

    playerManager.addPlayer(newPlayer);
    var enoughPlayerToStart = playerManager.players.length >= game.minPlayers;
    if(enoughPlayerToStart && ! game.isStarted) {
      game.start();
    }

    cb(newPlayer.color);
  });

  socket.on('user:disconnect', function(socketId) {
    playerManager.remove(socketId, function playerRemoved(isRemoved) {
      if(isRemoved) {
        var notEnoughPlayer = playerManager.players.length < game.minPlayers;
        if(notEnoughPlayer) {
          game.stop();
        }

        var zeroPlayer = playerManager.players.length === 0;
        if(zeroPlayer) {
          game.hide();
        }
      }
    });
  });

  socket.on('user:updatePosition', function(socketId, data) {
    playerManager.findBy({ id: socketId }, false, function playerFound(err, player) {
      if(! err) {
        player.updatePosition(data);
      }
    });
  });
};

socket.emit('room:new', newRoomCallback);