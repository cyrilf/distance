/**
 * Util object with useful functions
 * @type {Object}
 */
var util = {
  // Server address
  ADDRESS  : null,
  // Server port
  PORT     : null,
  /**
   * Generate a randomn id
   * @param  {Int}    length Length of the id
   * @return {String} id     The generated id
   */
  generateId: function (length) {
    length            = length || 5;
    var allowed       = 'abcdefghijklmnopqrstuvwxyz0123456789',
        allowedLength = allowed.length,
        id            = '';

    for(var i = 0; i < length; i++) {
      id += allowed.charAt(Math.floor(Math.random() * allowedLength));
    }

    return id;
  },

  /**
   * Return the vars from a url
   * @return {Array} Array with vars and values associated
   */
  getUrlVars: function() {
    var vars    = {};
    var parts   = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
    });

    return vars;
  }
};

