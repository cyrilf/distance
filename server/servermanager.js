var express         = require('express'),
    socketio        = require('socket.io'),
    path            = require('path'),
    socketManager   = require('./socketmanager'),
    routeManager    = require('./routemanager'),
    utilServer      = require('./utilserver');

/**
 * Usefull methods for the server to work.
 */
var serverManager = {
  /**
   * Configure the server with some default options
   * @param  {Object}   app  the server himself
   * @param  {String}   NAME   Name of the app
   * @param  {Number}   PORT port number
   */
  configure: function(app, NAME, PORT) {
    var lowerCaseName = NAME.toLowerCase();

    app.configure(function() {
      app.set('NAME', NAME);

      app.use(express.json());
      app.use(express.urlencoded());
      app.use(express.methodOverride());
      // Set the view folder and engine
      app.set('views', __dirname + '/../views');
      app.set('view engine', 'jade');
      // Define variables
      app.set(lowerCaseName + '.ADDRESS', utilServer.getIP());
      app.set(lowerCaseName + '.PORT', PORT);
      // Use it as a middleware to define default vars
      utilServer.app = app;
      app.use(utilServer.middleware);

      // Serve this static file
      app.get('/js/lodash.min.js', function(req,res) {
        res.sendfile(path.join(__dirname + '/..', 'node_modules/lodash/dist/lodash.min.js'));
      });

      app.use(app.router);
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
   * @param  {Object} app    express instance
   * @param  {Object} server http server instance
   * @param  {String} NAME   Name of the app
   * @param  {Number} PORT   Port number
   */
  run: function(app, server, NAME, PORT) {
    this.configure(app, NAME, PORT);

    var io = socketio.listen(server);
    server.listen(PORT);

    io.set('log level', 0);
    io.sockets.on('connection', socketManager.onSocketConnection);

    console.log('Open your browser at localhost://' + PORT + ' and enjoy the ' + NAME + ' experience!');
  }
};

module.exports = serverManager;