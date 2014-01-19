// This file relies on ./game files

var socket = io.connect(util.ADDRESS);

var roomId = util.generateId();
socket.emit('newRoom', roomId);

var roomURL = util.ADDRESS + ':' + util.PORT + '/' + roomId;

// We display the url
var gameLinks = document.getElementsByClassName('gameLink');
for(var i = 0, l = gameLinks.length; i < l; i++) {
  gameLinks[i].setAttribute('href', 'http://' + roomURL);
  gameLinks[i].innerHTML = ' ' + roomURL;
}

socket.on('newUser', function(socketId) {
  var newPlayer = new Player(socketId);

  var isFirstUser = playerManager.players.length === 0;
  if(isFirstUser) {
    Game.createCanvas();
    Game.runLoop();
  }

  playerManager.addPlayer(newPlayer);
});

socket.on('disconnectedUser', function(socketId) {
  playerManager.remove(socketId);

  var zeroPlayer = playerManager.players.length === 0;
  if(zeroPlayer) {
    Game.reset();
  }
});


socket.on('updatePosition', function(socketId, data) {
  playerManager.findBy({ id: socketId }, false, function playerFound(err, player) {
    if(! err) {
      player.updatePosition(data);
    }
  });
});