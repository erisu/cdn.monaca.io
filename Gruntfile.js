'use strict';

module.exports = function(grunt) {
  require('grunt-task-loader')(grunt);

  var SERVER_PROTOCOL = 'https';
  var SERVER_PORT = 2000;

  grunt.initConfig({
    connect: {
      server: {
        options: {
          livereload: true,
          protocol: SERVER_PROTOCOL,
          port: SERVER_PORT,
          hostname: '0.0.0.0',
          base: 'dist/',
          key: grunt.file.read('keys/server.key').toString(),
          cert: grunt.file.read('keys/server.crt').toString(),
          ca: grunt.file.read('keys/ca.crt').toString()
        }
      }
    },

    watch: {
      css: {
        files: 'src/**/*.sass',
        tasks: ['default']
      }
    },

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

  /**
   * Modified for Grunt and Connect
   * Original: http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js/8440736#8440736
   */
  grunt.registerTask('displayServerNetworkAddress', 'Display Network IP Address', function() {
    var os = require('os');
    var ifaces = os.networkInterfaces();

    grunt.log.writeln('Additional Web Server Connection Paths:');

    Object.keys(ifaces).forEach(function (ifname) {
      var alias = 0;

      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return;
        }

        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          grunt.log.writeln(SERVER_PROTOCOL + '://' + iface.address + ':' + SERVER_PORT);
        } else {
          // this interface has only one ipv4 adress
          grunt.log.writeln(SERVER_PROTOCOL + '://' + iface.address + ':' + SERVER_PORT);
        }
        ++alias;
      });
    });
  });

  grunt.registerTask('default', ['sass', 'cssmin']);
  grunt.registerTask('server', ['default', 'connect', 'displayServerNetworkAddress', 'watch']);
};
