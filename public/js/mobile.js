// This file relies on ./mobile files

// Connect to socketio
var socket = io.connect(util.ADDRESS);

// Inform the server that a new mobile is connected
if(! roomIdIsValid) {
  errorMessage.write('The room id is invalid. Check the url.');
} else {
  socket.emit('newMobile', roomId, function(err) {
    if(err) {
      errorMessage.write(err.message);
    }

    socket.on('destroyedRoom', function() {
      errorMessage.write('Room no longer available');
    });

    // If no errors occured on the server, we start listenning to
    // the device orientation events
    if(! err) {
      deviceOrientationManager.listen(socket);
    }
  });
}