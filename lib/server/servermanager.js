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
   * @param  {Object}   options
   */
  configure: function(options) {
    var opts  = options || {};
    opts.name = opts.name || 'distance';
    opts.port = opts.port || process.env.PORT || '2377';

    var app = express();

    var lowerCaseName = opts.name.toLowerCase();

    app.configure(function() {
      app.set('NAME', opts.name);

      app.use(express.json());
      app.use(express.urlencoded());
      app.use(express.methodOverride());
      // Set the view folder and engine
      app.set('views', __dirname + '/../../views');
      app.set('view engine', 'jade');
      // Define variables
      app.set(lowerCaseName + '.ADDRESS', utilServer.getIP());
      app.set(lowerCaseName + '.PORT', opts.port);
      // Use it as a middleware to define default vars
      utilServer.app = app;
      app.use(utilServer.middleware);

      // Serve this static file
      app.get('/js/lodash.min.js', function(req,res) {
        res.sendfile(path.join(__dirname + '/../..', 'node_modules/lodash/dist/lodash.min.js'));
      });

      app.use(app.router);
      routeManager.initRoutes(app);
    });

    app.configure('development', function() {
      app.use(express.static(__dirname + '/../../public'));
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    app.configure('production', function() {
      var oneYear = 31557600000;
      app.use(express.static(__dirname + '/../../public', { maxAge: oneYear }));
      app.use(express.errorHandler());
    });

    var server  = require('http').createServer(app);
    this.server = server;
    this.name   = opts.name;
    this.port   = opts.port;
  },

  /**
   * Run the server
   *   - Bind socket io to the server
   *   - Server start listenning on PORT
   *   - Initialization of the socket events
   * @param  {Object}   options (optional)
   */
  run: function(options) {
    if(options !== null && typeof options === 'object') {
      this.configure(options);
    }
    var io = socketio.listen(this.server);
    this.server.listen(this.port);

    io.set('log level', 0);
    io.sockets.on('connection', socketManager.onSocketConnection);

    console.log('Open your browser at localhost://' + this.port + ' and enjoy the ' + this.name + ' experience!');
  }
};

module.exports = serverManager;