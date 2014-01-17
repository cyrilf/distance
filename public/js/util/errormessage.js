/**
 * Display new error message
 * @param  {String} message error message
 */
var errorMessage = {

  /**
   * Write an error message on the page
   * @param  {String} message   error message
   * @param  {String} elementId the element id (falcultative)
   */
  write: function(message, elementId) {
    elementId = elementId || 'error';
    document.getElementById(elementId).innerHTML = message;
  }
};