var _ = require('lodash');

/**
 * Room class
 * A room is uniquely defined by his roomId.
 * It contains a websocket and a list of the user connected to it
 * @param {String}     roomId     Unique identifier for the room
 * @param {Web socket} roomSocket The socket for this room
 */
var Room = function(roomId, roomSocket) {
  var userSockets = [];

  /**
   * Emit alias to send message through this room's websocket
   */
  var emit = function(args) {
    this.roomSocket.emit.apply(this.roomSocket, arguments);
  };

  /**
   * Add an user to this room
   * @param {Web socket} socket The user socket
   */
  var addUser = function(socket) {
    this.userSockets.push(socket);
  };

  var removeUser = function(socket) {
    this.userSockets = _.without(this.userSockets, socket);
    this.emit('disconnectedUser', socket.id);
  };

  return {
    roomId        : roomId,
    roomSocket    : roomSocket,
    userSockets   : userSockets,

    emit          : emit,
    addUser       : addUser,
    removeUser    : removeUser
  };
};

/**
 * roomManager is an helper allowing us to easily work with the rooms collection
 * and do operations on it
 * @type {Object}
 */
var roomManager = {
  rooms: [],

  /**
   * Add a room to the array rooms
   * @param {Room} room The fresh new room created
   */
  addRoom: function(room) {
    this.rooms.push(room);
  },

  /**
   * Destroy a room (after a disconnection) but notifiy all the connected users first.
   * @param  {String} roomId Unique identifier for the room
   */
  destroy: function(roomId) {
    var self = this;
    this.findBy({roomId: roomId}, true, function roomIndexFoundF(err, roomIndexFound) {
      if(err) {
        console.log('Room not found. It can\'t be destroyed..');
        return;
      }

      // Send an emit notification to all the user sockets
      var room = self.rooms[roomIndexFound];
      var userSockets = room.userSockets;

      _(userSockets).forEach(function(userSocket) {
        userSocket.emit('destroyedRoom');
      });

      self.rooms.splice(roomIndexFound, 1);
    });
  },

  /**
   * Find a specific room in the rooms by a filter
   * @param  {Object}   filter    filter the collection by this
   * @param  {Boolean}  onlyIndex return only the room position (index) or the element himself
   * @param  {Function} fn        callback
   */
  findBy: function(filter, onlyIndex, fn) {
    var roomIndexFound = _.findIndex(this.rooms, filter);

    if(roomIndexFound === -1) {
      return fn({ message: 'Room not found' });
    }

    if(onlyIndex) {
      return fn(null, roomIndexFound);
    }


    var roomFound = this.rooms[roomIndexFound];

    return fn(null, roomFound);
  }
};

exports.Room        = Room;
exports.roomManager = roomManager;