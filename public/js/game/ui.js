var ui = {
  CANVAS_WIDTH    : window.innerWidth  - 30,
  CANVAS_HEIGHT   : window.innerHeight - 100,
  canvas          : null,
  ctx             : null,
  initialized     : false,
  backgroundColor : 'rgba(236, 240, 241,1.0)',

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
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    this.ctx.restore();
  },

  /**
   * Draw a circle with the parameters
   * @param  {Number} x     x of the draw center
   * @param  {Number} y     y of the draw center
   * @param  {Number} size  size of the circle
   * @param  {String} color color of the circle
   */
  drawCircle : function(x, y, size, color) {
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  },

  /**
   * Draw a player
   * @param  {Player} player player to draw
   */
  drawPlayer : function(player) {
    // Idea
    // UI shouldn't be aware of player structure and should only received the params value
    // (drawCircle should be called from outside rather than this one)
    this.drawCircle(player.x, player.y, player.size, player.color);
    var fontSize = player.size / 3;

    this.ctx.lineCap   = 'round';
    this.ctx.font      = fontSize + 'px verdana';
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillText(player.score, ((player.x) - (this.ctx.measureText(player.score).width / 2)), (player.y + fontSize / 2));
  },

  /**
   * Draw a sticker
   * @param  {Sticker} sticker sticker to draw
   */
  drawSticker : function(sticker) {
    this.drawCircle(sticker.x, sticker.y, sticker.size, sticker.color);
  }
};