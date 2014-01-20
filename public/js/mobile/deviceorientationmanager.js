/**
 * Listen and handle all the device orientation event and data
 * @type {Object}
 */
var deviceOrientationManager = {
  /**
   * Listen for the device orientation event
   */
  listen: function(socket) {
    var self = this;

    if(window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', function(eventData) {
        var tiltLR       = eventData.gamma;
        var tiltFB       = -eventData.beta;
        var direction    = eventData.alpha;

        self.emit(tiltLR, tiltFB, direction, socket);
      }, false);
    } else if(window.OrientationEvent) {
      window.addEventListener('MozOrientation', function(eventData) {
        var tiltLR       = eventData.x * 90;
        var tiltFB       = -eventData.y * -90;
        var direction    = eventData.z;

        self.emit(tiltLR, tiltFB, direction, socket);
      }, false);
    } else {
      errorMessage.write('Not supported on your device or browser.  Sorry.');
    }
  },

  /**
   * Send updated position data
   * @param  {Number} tiltLR    Tilt left to right
   * @param  {Number} tiltFB    Tilt front to back
   * @param  {[type]} direction Direction
   * @param  {Object} socket    Socket
   */
  emit: function(tiltLR, tiltFB, direction, socket) {
    socket.emit('newPosition', { tiltLR: Math.round(tiltLR), tiltFB: Math.round(tiltFB), direction: Math.round(direction) }, function(err) {
      if(err) {
        errorMessage.write(err.message);
      }
    });
  }
};