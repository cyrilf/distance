// This file relies on ./mobile files

// Connect to socketio
var socket = io.connect(util.BASE_URL);

// Retrieve the rommId from URL
var roomId = util.getUrlVars().id;

// Inform the server that a new mobile is connected
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