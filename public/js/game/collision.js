var collisionManager = {
  check: function(players, stickers) {
    var collision = null;
    collision     = this.checkCollisionBetweenPlayers(players) ||
                    this.checkCollisionWithStickers(players, stickers);

    return collision;
  },

  checkCollisionBetweenPlayers: function(players) {
    var i             = 0,
        j             = 0,
        playersLength = players.length,
        playerA       = null,
        playerB       = null;

    for(; i < playersLength; i++) {
      playerA = players[i];
      for(; j < playersLength; j++) {
        playerB = players[j];

        if(playerA.id === playerB.id) {
          continue;
        }

        if(this.checkCollisionBetweenCircles(playerA, playerB)) {
          var collision = {
            type: 'player'
          };
          collision.playerA = playerA;
          collision.playerB = playerB;

          return collision;
        }
      }
    }

    return null;
  },

  checkCollisionWithStickers: function(players, stickers) {
    var i              = 0,
        j              = 0,
        playersLength  = players.length,
        stickersLength = stickers.length,
        player         = null,
        sticker        = null;

    for(; i < playersLength; i++) {
      j = 0;
      player = players[i];
      for(; j < stickersLength; j++) {
        sticker = stickers[j];

        if(this.checkCollisionBetweenCircles(player, sticker)) {
          var collision = {
            type: 'sticker'
          };
          collision.player  = player;
          collision.sticker = sticker;

          return collision;
        }

      }
    }

    return null;
  },

  checkCollisionBetweenCircles: function(circleA, circleB) {
    var a = circleA.size + circleB.size,
        x = circleA.x - circleB.x;
        y = circleA.y - circleB.y;

    if (a > Math.sqrt((x * x) + (y * y))) {
      return true;
    } else {
      return false;
    }
  }
};