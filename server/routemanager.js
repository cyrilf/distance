var _ = require('lodash');

// Routes definition
var home = function(req, res, next) {
  return res.redirect('/app');
};

var app = function(req, res, next) {
  return res.render('app/index');
};

var mobile = function(req, res, next) {
  return res.render('app/mobile');
};

var routes = {
  '/':       home,
  '/app':    app,
  '/mobile': mobile
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