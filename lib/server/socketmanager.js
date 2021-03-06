var Room        = require('./room').Room;
var roomManager = require('./room').roomManager;
var _           = require('lodash');

/**
 * socketManager is an helper for handling socket events
 * @type {Object}
 */
var socketManager = {

  /**
   * Fired when a new socket is connected,
   * set up all the events
   * @param  {Web socket} socket new web socket
   */
  onSocketConnection: function(socket) {

    // When a new computer join, we create a room.
    socket.on('room:new', socketManager.newRoom);
    // Update a player score
    socket.on('user:score', socketManager.updateScore);
    // Launch a new game
    socket.on('game:new', socketManager.newGame);
    // Game is over (we got a winner)
    socket.on('game:over', socketManager.gameOver);

    // When a new mobile join
    socket.on('user:new', socketManager.newMobile);

    // Update the position
    socket.on('user:updatePosition', socketManager.updatePosition);

    // When a user disconnects
    socket.on('disconnect', socketManager.disconnect);
  },

  /**
   * Events functions definitions
   * FYI, `this` in functions below define the web socket
   * (as it's a callback from a `on` event)
   */

  /**
   * New room creation
   * @param  {Function} fn callback
   */
  newRoom: function(fn) {
    var socket = this;
    roomManager.roomId.generate(5, function roomIdGenerated(err, roomId) {
      if(err) {
        return fn(err);
      }

      // Only for debug purpose
      roomId = 'dream';

      roomManager.addRoom(new Room(roomId, socket));
      socket.set('roomId', roomId);
      socket.set('isRoom', true);

      fn(null, roomId);
    });
  },

  /**
   * Update the score on mobile client
   * @param  {Id}     playerId the player id
   * @param  {Int}    score    new score
   */
  updateScore: function(playerId, score) {
    var socket = this;
    if(socket.store.data.isRoom) {
      roomManager.findBy({ roomId: socket.store.data.roomId }, false, function roomFound(err, room) {
        if(err) {
          return console.log(err);
        }

        _(room.userSockets).each(function userSocketsIterator(player) {
          if(player.id === playerId) {
            player.emit('user:score', score);
          }
        });
      });
    }
  },

  /**
   * A new game begin
   */
  newGame: function() {
    var socket = this;
    if(socket.store.data.isRoom) {
      roomManager.findBy({ roomId: socket.store.data.roomId }, false, function roomFound(err, room) {
        if(err) {
          return console.log(err);
        }

        _(room.userSockets).each(function userSocketsIterator(player) {
          player.emit('game:new');
        });
      });
    }
  },

  /**
   * The game is over, we got a winner
   * @param  {Id} winnerId the winner id
   */
  gameOver: function(winnerId) {
    var socket = this;
    if(socket.store.data.isRoom) {
      roomManager.findBy({ roomId: socket.store.data.roomId }, false, function roomFound(err, room) {
        if(err) {
          return console.log(err);
        }

        _(room.userSockets).each(function userSocketsIterator(player) {
          player.emit('game:over', winnerId);
        });
      });
    }
  },

  /**
   * New mobile connected
   *   - Find the requested room
   *   - Add a user to it
   *   - Emit the new user event
   *   - Link the room id to the socket
   * @param  {String}   roomId Unique identifier for the room
   * @param  {Function} fn     Callback
   */
  newMobile: function(roomId, fn) {
    var socket = this;

    // We search for the room he is asking
    roomManager.findBy({ roomId: roomId }, false, function roomFound(err, room) {
      if(err) {
        return fn(err);
      }

      // We add the socket to the users
      room.addUser(socket);
      // We stock the roomId value in the socket (for next calls)
      socket.set('roomId', room.roomId);
      // We notify the room that a new user is in.
      room.emit('user:new', socket.id, function(color) {
        return fn(null, color);
      });
    });
  },

  /**
   * Update the user position
   *   - Find the associated room
   *   - Emit a message on this room for the new position
   * @param  {Object}   data User new position
   * @param  {Function} fn   Callback
   */
  updatePosition: function(data, fn) {
    var socket = this;
    var roomId = socket.store.data.roomId;

    if(typeof roomId !== 'undefined') {
      roomManager.findBy({ roomId: roomId }, false, function roomFound(err, room) {
        if(err) {
          return fn(err);
        }


        room.emit('user:updatePosition', socket.id, data);

        return fn();
      });
    } else {
      return fn('Room id is undefined');
    }
  },

  /**
   * Disconnect event
   *   - If it's a room socket, destroy the room
   *   - If it's a user socket, find the room associated and destroy the user from it
   * @return {[type]} [description]
   */
  disconnect: function() {
    var socket = this;
    var roomId = socket.store.data.roomId || undefined;
    var isRoom = socket.store.data.isRoom || false;

    // If it's a computer (a room) not a mobile, we destroy it
    if(isRoom && roomId) {
      roomManager.destroy(roomId);
    } else if(roomId) { // Otherwise, we remove the userSocket from the room and we emit an event to the room
      roomManager.findBy({roomId: roomId}, false, function roomFound(err, room) {
        if(err) {
          console.log('Room not found [' + roomId + ']. Can\'t delete user from it. #captainObvious');
          return;
        }

        room.removeUser(socket);
      });
    }
  }
};

module.exports = socketManager;