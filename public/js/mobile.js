// This file relies on ./mobile files

var mobile = {
  socket: io.connect(util.ADDRESS),
  deviceOrientationManager: deviceOrientationManager,
  vibrator: vibrator,

  scoreElement: document.getElementById('score'),

  newUser: function(err, color) {
    if(err) {
      errorMessage.write(err.message);
    }

    var body = document.body;
    body.style['background-color'] = color;

    this.socket.on('user:score', this.userUpdateScore.bind(this));

    this.socket.on('game:new', this.newGame.bind(this));
    this.socket.on('game:over', this.gameOver.bind(this));

    this.socket.on('room:destroy', function() {
      errorMessage.write('Room no longer available');
    });

    // If no errors occured on the server, we start listenning to
    // the device orientation events
    if(! err) {
      this.deviceOrientationManager.listen(this.socket);
    }
  },
  userUpdateScore: function(score, vibration) {
    this.vibrator.vibrate(vibration);
    var mobile       = document.getElementById('mobile'),
        instruction  = document.getElementById('instruction');

    instruction.style.display  = 'none';
    this.scoreElement.style.display = 'block';
    this.scoreElement.innerHTML     = score;
  },

  newGame: function() {
    this.scoreElement.innerHTML = 0;
  },

  gameOver: function(winnerId) {
    // this path to sessionid seems weird..
    if(this.socket.socket.sessionid === winnerId) {
      this.scoreElement.innerHTML = 'WINNER!';
      this.vibrator.vibrateWinner();
    } else {
      this.scoreElement.innerHTML = 'Looser..';
      this.vibrator.vibrateLooser();
    }
  }
};

// Inform the server that a new mobile is connected
if(! roomIdIsValid) {
  errorMessage.write('The room id is invalid. Check the url.');
} else {
  mobile.socket.emit('user:new', roomId, mobile.newUser.bind(mobile));
}