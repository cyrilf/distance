// This file relies on ./game.js

/**
 * Manage the players
 * @type {Object}
 */
var playerManager = {
  players: [],
  colors: ['rgba(22, 160, 133, 1.0)',  'rgba(39, 174, 96, 1.0)',
           'rgba(41, 128, 185, 1.0) ', 'rgba(241, 196, 15, 1.0)',
           'rgba(142, 68, 173, 1.0)',  'rgba(231, 76, 60, 1.0)',
           'rgba(127, 140, 141, 1.0)', 'rgba(44, 62, 80, 1.0)'],

  /**
   * Add a player to the array players
   * @param {Player} player The fresh new player created
   */
  addPlayer: function(player) {
    this.players.push(player);
  },

  /**
   * Return an available color
   * @return {String} color
   */
  generateColor: function() {
    return (this.colors.length > 0) ? this.colors.shift() : 'black';
  },

  /**
   * Remove a player
   * @param  {Id} socketId Unique identifier for the player
   */
  remove: function(socketId) {
    var self = this;

    this.findBy({id: socketId}, true, function playerIndexFoundF(err, playerIndexFound) {
      if(err) {
        console.log('Player not found. It can\'t be destroyed..');
        return;
      }

      var player = self.players[playerIndexFound];

      if(player.color !== 'black') {
        self.colors.unshift(player.color);
      }
      if(playerIndexFound !== null) {
        self.players.splice(playerIndexFound, 1);
      }
    });
  },

  /**
   * Find a specific player in the players by a filter
   * @param  {Object}   filter    filter the collection by this
   * @param  {Boolean}  onlyIndex return only the player position (index) or the element himself
   * @param  {Function} fn        callback
   */
  findBy: function(filter, onlyIndex, fn) {
    var playerIndexFound = _.findIndex(this.players, filter);

    if(playerIndexFound === -1) {
      return fn({ message: 'Player not found' });
    }

    if(onlyIndex) {
      return fn(null, playerIndexFound);
    }


    var playerFound = this.players[playerIndexFound];

    return fn(null, playerFound);
  }
};

/**
 * Player object
 * @param {Id} id    unique id that defines the player (extracted from socketId)
 * @param {String} color Color for the player
 */
var Player = function(id, color) {
  var smoothingLR   = [],
      smoothingFB   = [],
      smoothedLR    = 0,
      smoothedFB    = 0,

      x = Game.CANVAS_WIDTH / 2,
      y = Game.CANVAS_HEIGHT / 2,
      size  = 100;

  color = color || playerManager.generateColor();

  /**
   * Keep the player into game bounds
   */
  var _keepPlayerIntoBounds = function(player) {
    if(player.x < player.size) {
      player.x = player.size;
    } else if(player.x > Game.CANVAS_WIDTH - player.size) {
      player.x = Game.CANVAS_WIDTH - player.size;
    }

    if(player.y < player.size) {
      player.y = player.size;
    } else if(player.y > Game.CANVAS_HEIGHT - player.size) {
      player.y = Game.CANVAS_HEIGHT - player.size;
    }
  };

  /**
   * Update the player position
   * @param  {Object} data Device orientation data
   */
  var updatePosition = function(data) {
    var tiltLR = data.tiltLR;
    var tiltFB = data.tiltFB;

    if((tiltLR < 2) && (tiltLR > -2)){  tiltLR = 0;  }
    if((tiltFB < 2) && (tiltFB > -2)){  tiltFB = 0;  }

    if(this.smoothingLR.length >= 5){ this.smoothingLR.shift();    }
    if(this.smoothingFB.length >= 5){ this.smoothingFB.shift();   }
    this.smoothingLR.push(tiltLR);
    this.smoothingFB.push(tiltFB);
    this.smoothedLR = 0;
    this.smoothedFB = 0;

    for(i = 0; i < this.smoothingLR.length; i++){
      this.smoothedLR += this.smoothingLR[i];
    }
    for(i = 0; i < this.smoothingFB.length; i++){
      this.smoothedFB += this.smoothingFB[i];
    }

    this.smoothedLR /= this.smoothingLR.length;
    this.smoothedFB /= this.smoothingFB.length;

    var speed = this.smoothedLR;

    //if tilting right, increase left, else, decrease
    if((this.smoothedLR > 3) || (this.smoothedLR < -3)){
      this.x += speed/2;
    }

    speed = this.smoothedFB;
    //if tilting right, increase left, else, decrease
    if((this.smoothedFB > 3) || (this.smoothedFB <-3)){
      this.y -= speed;
    }

    _keepPlayerIntoBounds(this);
  };

  return {
    id             : id,
    color          : color,
    smoothingLR    : smoothingLR,
    smoothingFB    : smoothingFB,
    smoothedLR     : smoothedLR,
    smoothedFB     : smoothedFB,
    x              : x,
    y              : y,
    size           : size,

    updatePosition : updatePosition
  };
};