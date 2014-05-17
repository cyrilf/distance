// This file relies on ./player.js
// This file relies on ./ui.js

/**
 * Game object that handle the canvas + game loop
 * @type {Object}
 */
var game = {
  minPlayers    : 2,
  isPlaying     : false,
  ui            : ui,

  /**
   * Create the canvas element and init the context 2d
   */
  initUI  : function() {
    document.getElementById('navigate-to').style.visibility = 'visible';
    document.getElementById('info-intro').style.display     = 'none';
    this.ui.init();
  },

  /**
   * Reset the app display
   */
  reset : function() {
    this.ui.hide();
    document.getElementById('navigate-to').style.visibility    = 'hidden';
    document.getElementById('info-intro').style.display        = 'block';
  },

  /**
   * Draw the players
   */
  drawPlayers : function() {
    var self = this;
    _(playerManager.players).each(function playerIterator(player) {
      self.ui.draw(player);
    });
  },

  /**
   * Game loop
   *   - clear the canvas
   *   - draw the players
   *
   * (the player position is updated on a socket event)
   */
  runLoop : function() {
    this.ui.clearCanvas();
    this.drawPlayers();
    requestAnimationFrame(this.runLoop.bind(this));
  }
};