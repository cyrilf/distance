// This file relies on ./mobile files

// Connect to socketio
var socket = io.connect(util.ADDRESS);

// Inform the server that a new mobile is connected
if(! roomIdIsValid) {
  errorMessage.write('The room id is invalid. Check the url.');
} else {
  socket.emit('user:new', roomId, function(err, color) {
    if(err) {
      errorMessage.write(err.message);
    }

    var body = document.body;
    body.style['background-color'] = color;

    socket.on('user:score', function(score) {
      if (window.navigator.vibrate) {
        window.navigator.vibrate([100]);
      }
      var mobile       = document.getElementById('mobile'),
          instruction  = document.getElementById('instruction'),
          scoreElement = document.getElementById('score');

      instruction.style.display  = 'none';
      scoreElement.style.display = 'block';
      scoreElement.innerHTML     = score;
    });

    socket.on('room:destroy', function() {
      errorMessage.write('Room no longer available');
    });

    // If no errors occured on the server, we start listenning to
    // the device orientation events
    if(! err) {
      deviceOrientationManager.listen(socket);
    }
  });
}