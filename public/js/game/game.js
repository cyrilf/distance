// This file relies on ./player.js
// This file relies on ./ui.js

/**
 * Game object that handle the canvas + game loop
 * @type {Object}
 */
var game = {
  ui            : ui,
  minPlayers    : 2,
  isStarted     : false,

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
      self.ui.drawPlayer(player);
    });
  },

  /**
   * Draw the stickers
   */
  drawStickers : function() {
    var self = this;
    _(stickerManager.stickers).each(function stickerIterator(sticker) {
      self.ui.drawSticker(sticker);
    });
  },

  /**
   * Start a new game (random point to capture, score, ..)
   */
  start : function() {
    this.isStarted = true;
    stickerManager.newSticker();
  },

  /**
   * Stop the game
   */
  stop : function() {
    stickerManager.empty();
    playerManager.resetScore();
    this.isStarted = false;
  },

  /**
   * Game loop
   *   - clear the canvas
   *   - draw the players
   *
   * (the player position is updated on a socket event)
   */
  runLoop : function() {
    this.manageCollision();
    this.updateDisplay();
    requestAnimationFrame(this.runLoop.bind(this));
  },

  /**
   * Update the game display on each game loop
   */
  updateDisplay : function() {
    this.ui.clearCanvas();
    this.drawStickers();
    this.drawPlayers();
  },

  /**
   * Manage the collisions (count score, bounce players, ..)
   */
  manageCollision : function() {
    if(this.isStarted) {
      var collision = collisionManager.check(playerManager.players, stickerManager.stickers);
      if(collision && collision.type === 'sticker') {
        this.manageScore(collision);
        stickerManager.remove(collision.sticker.id);
        stickerManager.newSticker();
        collision.player.size -= collision.player.size / 9;
      }
    }
  },

  /**
   * Manage the score
   * @param  {Object} collision a collision details
   */
  manageScore : function(collision) {
    var value = collision.sticker.value;
    collision.player.score += value;
  }
};