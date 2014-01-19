var express       = require('express');
var socketio      = require('socket.io');
var path          = require('path');
var socketManager = require('./socketmanager');
var routeManager  = require('./routemanager');

/**
 * Usefull methods for the server to work.
 */
var serverManager = {
  /**
   * Configure the server with some default options
   * @param  {Object}   app the server himself
   */
  configure: function(app) {
    app.configure(function() {
      app.use(express.json());
      app.use(express.urlencoded());
      app.use(express.methodOverride());
      app.use(app.router);
      app.set('views', __dirname + '/../views');
      app.set('view engine', 'jade');
      app.get('/js/lodash.min.js', function(req,res) {
        res.sendfile(path.join(__dirname + '/..', 'node_modules/lodash/dist/lodash.min.js'));
      });
      routeManager.initRoutes(app);
    });

    app.configure('development', function() {
      app.use(express.static(__dirname + '/../public'));
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    app.configure('production', function() {
      var oneYear = 31557600000;
      app.use(express.static(__dirname + '/../public', { maxAge: oneYear }));
      app.use(express.errorHandler());
    });
  },

  /**
   * Run the server
   *   - Bind socket io to the server
   *   - Server start listenning on PORT
   *   - Initialization of the socket events
   * @param  {Object} server server instance
   * @param  {Number} PORT   Port number
   */
  run: function(server, PORT) {
    var io = socketio.listen(server);
    server.listen(PORT);

    io.set('log level', 0);
    io.sockets.on('connection', socketManager.onSocketConnection);

    console.log('Open your browser at localhost://' + PORT + ' and enjoy the distance experience!');
  }
};

module.exports = serverManager;