// This file relies on ./game.js

/**
 * Manage the stickers
 * @type {Object}
 */
var stickerManager = {
  stickers: [],
  colors: ['rgba(22, 160, 133, 1.0)',  'rgba(39, 174, 96, 1.0)',
           'rgba(41, 128, 185, 1.0) ', 'rgba(241, 196, 15, 1.0)',
           'rgba(142, 68, 173, 1.0)',  'rgba(231, 76, 60, 1.0)',
           'rgba(127, 140, 141, 1.0)', 'rgba(44, 62, 80, 1.0)'],

  /**
   * Generate a new sticker and add it
   */
  newSticker: function() {
    var value = 1,
        size  = 10,
        color = this.generateColor();

    var sticker = new Sticker(value, size, color);
    this.addSticker(sticker);
  },

  /**
   * Add a sticker to the array stickers
   * @param {Sticker} sticker The fresh new sticker created
   */
  addSticker: function(sticker) {
    this.stickers.push(sticker);
  },

  /**
   * Generate an id
   * @return {String} an id (unique? not really but enough for now)
   */
  generateId: function() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  },

  /**
   * Return an available color
   * @return {String} color
   */
  generateColor: function() {
    var length = this.colors.length,
        random = Math.floor(Math.random() * length);
    return this.colors[random];
  },

  /**
   * Remove a sticker
   * @param  {Id} id Unique identifier for the sticker
   */
  remove: function(id) {
    var self = this;

    this.findBy({id: id}, true, function stickerIndexFoundF(err, stickerIndexFound) {
      if(err) {
        console.log('Sticker not found. It can\'t be destroyed..');
        return;
      }

      var sticker = self.stickers[stickerIndexFound];

      if(sticker.color !== 'black') {
        self.colors.unshift(sticker.color);
      }
      if(stickerIndexFound !== null) {
        self.stickers.splice(stickerIndexFound, 1);
      }
    });
  },

  /**
   * Remove all stickers
   */
  empty: function() {
    var self = this;
    _(this.stickers).each(function stickerIterator(sticker) {
      self.remove(sticker.id);
    });
  },

  /**
   * Find a specific sticker in the stickers by a filter
   * @param  {Object}   filter    filter the collection by this
   * @param  {Boolean}  onlyIndex return only the sticker position (index) or the element himself
   * @param  {Function} fn        callback
   */
  findBy: function(filter, onlyIndex, fn) {
    var stickerIndexFound = _.findIndex(this.stickers, filter);

    if(stickerIndexFound === -1) {
      return fn({ message: 'Sticker not found' });
    }

    if(onlyIndex) {
      return fn(null, stickerIndexFound);
    }


    var stickerFound = this.stickers[stickerIndexFound];

    return fn(null, stickerFound);
  }
};

/**
 * Sticker object
 * @param {Id} id    unique id that defines the sticker (extracted from socketId)
 * @param {String} color Color for the sticker
 */
var Sticker = function(value, size, color) {
  var id    = stickerManager.generateId();
  value = value || 1;
  size  = size  || 10;
  color = color || stickerManager.generateColor();

  /**
   * Generate a random position
   * @return {Object} Object with the random x and random y
   */
  var _generateRandomPosition = function() {
    var maxX = game.ui.CANVAS_WIDTH - size,
        maxY = game.ui.CANVAS_HEIGHT - size;

        x = Math.random() * (maxX - size) + size,
        y = Math.random() * (maxY - size) + size;

    return {
      x : x,
      y : y
    };
  };

  var randomPosition = _generateRandomPosition(),
      x = randomPosition.x,
      y = randomPosition.y;

  return {
    id    : id,
    value : value,
    size  : size,
    color : color,
    x     : x,
    y     : y
  };
};