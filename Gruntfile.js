'use strict';

module.exports = function(grunt) {
  require('grunt-task-loader')(grunt);

  grunt.initConfig({
    sass: {
      options: {
        sourceMap: false,
        includePaths: ["node_modules/compass-sass-mixins/lib/"]
      },
      dist: {
        files: {
          "dist/monaca-components.css": "src/monaca-components.sass"
        }
      }
    },

    cssmin: {
      options: {
        shorthandCompacting: true,
        roundingPrecision: -1,
        sourceMap: true
      },
      target: {
        files: [{
          expand: true,
          cwd: 'dist',
          src: ['*.css', '!*.min.css'],
          dest: 'dist',
          ext: '.min.css'
        }]
      }
    }
  });

  grunt.registerTask('default', ['sass', 'cssmin']);
};
