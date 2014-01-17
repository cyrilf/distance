module.exports = function(grunt) {

  /**
   * CONFIGURATION
   */
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      grunt: 'Gruntfile.js',
      files: ['**/*.js'],
    }
  });

  /**
   * IMPORTS
   */
  grunt.loadNpmTasks('grunt-contrib-jshint');

  /**
   * TASKS
   */
  grunt.registerTask('default', ['jshint']);
};