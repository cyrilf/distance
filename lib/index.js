// Export the server manager as a 'distance' object
var serverManager = require('./server/servermanager');

// Distance
var distance = {
  configure: serverManager.configure,
  run:       serverManager.run
};

// Exports
module.exports = distance;
