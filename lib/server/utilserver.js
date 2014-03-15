var _ = require('lodash'),
    os = require('os');

var utilServer = {
  app: null,
  // Get the ip of the current server
  getIP: function() {
    var ip = _.chain(os.networkInterfaces())
                .map(function(value, index) { return [value]; })
                .flatten()
                .filter(function(val) {
                  return (val.family === 'IPv4' && val.internal === false);
                })
                .pluck('address')
                .first()
                .value();

    return ip;
  },

  // Inject some variable to all responses
  middleware: function(req, res, next) {
    var _render = res.render;

    var appName = utilServer.app.get('NAME');
    var appNameLowerCase = appName.toLowerCase();

    var defaultVariables               = {};
    defaultVariables[appNameLowerCase] = {
      NAME: appName,
      ADDRESS: utilServer.app.get(appNameLowerCase + '.ADDRESS'),
      PORT: utilServer.app.get(appNameLowerCase + '.PORT')
    };

    res.render = function(view, variables, cb) {
      variables = variables || {};
      variables = _.extend(defaultVariables, variables);
      _render.call(res, view, variables, cb);
    };

    next();
  }
};

module.exports = utilServer;