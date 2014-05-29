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
   * Set the address
   * If we're not in localhost then we display the hostname rather than the ip address
   * @param {String} address
   */
  setAddress: function(address) {
    var hostname = window.location.hostname;
    if(hostname === 'localhost') {
      this.ADDRESS = address;
    } else {
      this.ADDRESS = hostname;
    }
  },

  /**
   * Set the port
   * @param {Int} port
   */
  setPort: function(port) {
    this.PORT = port;
  }
};
