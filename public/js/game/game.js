// This file relies on ./player.js

/**
 * Game object that handle the canvas + game loop
 * @type {Object}
 */
var Game = {
  CANVAS_WIDTH  : window.innerWidth  - 30,
  CANVAS_HEIGHT : window.innerHeight - 100,
  canvas        : null,
  ctx           : null,
  initialized   : false,

  /**
   * Create the canvas element and init the context 2d
   */
  createCanvas  : function() {
    document.getElementById('navigate-to').style.visibility    = 'visible';
    document.getElementById('info-intro').style.display        = 'none';
    document.getElementById('canvas-section').style.display    = 'block';

    if(! this.initialized) {
      this.canvas        = document.createElement('canvas');
      this.canvas.id     = 'mainCanvas';
      this.canvas.width  = this.CANVAS_WIDTH;
      this.canvas.height = this.CANVAS_HEIGHT;
      document.body.appendChild(this.canvas);

      var canvasSection = document.getElementById('canvas-section');
      canvasSection.appendChild(this.canvas);

      this.ctx = this.canvas.getContext('2d');
      this.initialized = true;
    }
  },

  /**
   * Reset the app display
   */
  reset : function() {
    document.getElementById('canvas-section').style.display    = 'none';
    document.getElementById('navigate-to').style.visibility    = 'hidden';
    document.getElementById('info-intro').style.display        = 'block';
  },

  /**
   * Clear the canvas
   */
  clearCanvas : function() {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = 'rgba(236, 240, 241,1.0)';
    this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    this.ctx.restore();
  },

  /**
   * Draw the players
   */
  drawPlayers : function() {
    var self = this;
    _(playerManager.players).each(function playerIterator(player) {
      self.draw(player);
    });
  },

  /**
   * Draw a player
   * @param  {Player} player player to draw
   */
  draw : function(player) {
    this.ctx.save();
    this.ctx.fillStyle = player.color;
    this.ctx.beginPath();
    this.ctx.arc(player.x, player.y, player.size, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  },

  /**
   * Game loop
   *   - clear the canvas
   *   - draw the players
   *
   * (the player position is updated on a socket event)
   */
  runLoop : function() {
    this.clearCanvas();
    this.drawPlayers();
    requestAnimationFrame(this.runLoop.bind(this));
  }
};