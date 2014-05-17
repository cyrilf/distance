var _ = require('lodash');

// Routes definition
var home = function(req, res, next) {
  return res.redirect('/app');
};

var app = function(req, res, next) {
  return res.render('app/index');
};

var mobile = function(req, res, next) {
  var roomId = req.params.roomId;

  if(roomId === 'favicon.ico') {
    return next();
  }

  var roomIdIsValid = true;
  if(roomId === undefined || ! _.isString(roomId) || roomId.length !== 5) {
    roomIdIsValid = false;
  }

  return res.render('app/mobile', {
    roomId: roomId,
    roomIdIsValid: roomIdIsValid
  });
};

var routes = {
  '/':        home,
  '/app':     app,
  '/:roomId': mobile
};

/**
 * Manage the routes for the app
 * @type {Object}
 */
var routeManager = {

  initRoutes: function(app) {
    _.each(routes, function routesIterator(routeAction, route) {
      app.get(route, routeAction);
    });
  }
};

module.exports = routeManager;