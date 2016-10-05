'use strict';

module.exports = function(grunt) {
  require('grunt-task-loader')(grunt);
  grunt.loadNpmTasks('grunt-aws-s3');

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
        files: 'src/**/*',
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
          "dist/css/monaca-components.css": "src/sass/monaca-components.sass"
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
          cwd: 'dist/css',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/css/',
          ext: '.min.css'
        }]
      }
    },
    copy: {
      assets: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['img/**'],
          dest: 'dist/'
        }]
      }
    },

    aws_s3: {
      options: {
        accessKeyId: grunt.option('aws-key'),
        secretAccessKey: grunt.option('aws-secret'),
        uploadConcurrency: 10,
        downloadConcurrency: 10,
        bucket: grunt.option('aws-bucket'),
        region: grunt.option('aws-region')
      },
      prod: {
        files: [{
          action: "delete", 
          dest: '/'
        }, {
          expand: true, cwd: 
          'dist', src: ['**'], 
          dest: ''
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

   grunt.registerTask('default', ['sass', 'cssmin', 'copy']);
   grunt.registerTask('deploy', ['default', 'aws_s3:prod']);
   grunt.registerTask('server', ['default', 'connect', 'displayServerNetworkAddress', 'watch']);
 };
