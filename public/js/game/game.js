// This file relies on ./player.js
// This file relies on ./ui.js

/**
 * Game object that handle the canvas + game loop
 * @type {Object}
 */
var game = {
  ui            : ui,
  minPlayers    : 2,
  scoreMax      : 10,
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
   * Hide the game
   */
  hide : function() {
    this.ui.hide();
    this.stop();
    document.getElementById('navigate-to').style.visibility    = 'hidden';
    document.getElementById('info-intro').style.display        = 'block';
  },

  /**
   * Draw the players
   */
  drawPlayers : function() {
    var self = this,
        withScore = false;
    if(this.isStarted) {
      withScore = true;
    }
    _(playerManager.players).each(function playerIterator(player) {
      self.ui.drawPlayer(player, withScore);
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
    this.socket.emit('game:new');
    stickerManager.newSticker();
  },

  /**
   * Reset the game
   * @param  {Player} winner the winner
   */
  restart : function(winner) {
    var self = this;

    this.stop('restart');

    // We set 3 sec break ;)
    setTimeout(function resetBreak() {
      playerManager.reset();
      self.start();
      self.runLoop();
    }, 3000);
  },

  /**
   * Stop the game
   * @param  {String} reason reason for calling the stop
   */
  stop : function(reason) {
    this.isStarted = false;
    stickerManager.empty();
    if(reason !== 'restart') {
      playerManager.reset();
    }
  },

  /**
   * Game loop
   *   - clear the canvas
   *   - draw the players
   *
   * (the player position is updated on a socket event)
   */
  runLoop : function() {
    var winner = this.manageCollision();
    this.updateDisplay();
    if(winner) {
      this.restart(winner);
    } else {
      requestAnimationFrame(this.runLoop.bind(this));
    }
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
   * @return {Object} return the winner, null otherwise
   */
  manageCollision : function() {
    if(this.isStarted) {
      var collision = collisionManager.check(playerManager.players, stickerManager.stickers);
      if(collision && collision.type === 'sticker') {
        var winner = this.manageScore(collision);
        stickerManager.remove(collision.sticker.id);
        stickerManager.newSticker();
        collision.player.size -= collision.player.size / 9;
        return winner;
      }
    }

    return null;
  },

  /**
   * Manage the score
   * @param  {Object} collision a collision details
   */
  manageScore : function(collision) {
    var value = collision.sticker.value;

    // Collision with sticker of the same color = points * 2
    if(collision.sticker.color === collision.player.color) {
      value += value;
    }
    collision.player.score += value;
    this.socket.emit('user:score', collision.player.id, collision.player.score);
    var scoreMaxReached = (collision.player.score >= this.scoreMax);
    if(scoreMaxReached) {
      return collision.player;
    }

    return null;
  }
};