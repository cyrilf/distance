var vibrator = {
  sequences: {
    default: 100,
    twice: [200, 100, 200],
    long: 3000
  },

  /**
   * Either vibration API is supported by the navigator or not
   * @return {Boolean}  is supported
   */
  isSupported: function() {
    canVibrate = 'vibrate' in navigator || 'mozVibrate' in navigator;
    // Normalize the navigator.vibrate calls
    if(canVibrate  && !(('vibrate') in navigator)) {
      navigator.vibrate = navigator.mozVibrate;
    }

    return canVibrate;
  },

  /**
   * Run a vibration
   * @param  {int, array} input
   *     int: vibration duration (in milliseconds) (i.e.: 1000)
   *     array: vibration duration, pause duration, vibration duration, ..
   *             (i.e.: [200, 100, 200]) or [300, 10, 200, 100, 20])
   */
  vibrate: function(input) {
    if(typeof(input) === 'undefined' || input === null) {
      input = this.sequences.default;
    }
    if(this.isSupported()) {
      navigator.vibrate(input);
    }
  },

  /**
   * Vibrate twice
   */
  vibrateTwice: function() {
    this.vibrate(this.sequences.twice);
  },

  /**
   * Vibrate long
   */
  vibrateLong: function() {
    this.vibrate(this.sequences.long);
  },

  /**
   * Stop all vibrations
   */
  stop: function() {
    this.vibrate(0);
  }
};