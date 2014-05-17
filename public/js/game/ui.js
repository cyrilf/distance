var ui = {
  CANVAS_WIDTH  : window.innerWidth  - 30,
  CANVAS_HEIGHT : window.innerHeight - 100,
  canvas        : null,
  ctx           : null,
  initialized   : false,

  /**
   * Initialize the canvas
   */
  init : function() {
    document.getElementById('canvas-section').style.display = 'block';

    if(! this.initialized) {
      this.canvas        = document.createElement('canvas');
      this.canvas.id     = 'main-canvas';
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
   * Hide the canvas section
   */
  hide : function() {
    document.getElementById('canvas-section').style.display = 'none';
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
};