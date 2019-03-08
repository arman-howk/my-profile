module.exports = function(grunt) {

  var Fiber = require('fibers');
  var sass = require('node-sass');

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      sass: {
          options: {
              implementation: sass,
              fiber: Fiber,
              sourceMap: true,

          },
          dist: {
              files: {
                  'css/main.css': 'sass/*.scss'
              }
          }
      },

      cssmin: {
          target: {
              files: [{
                  expand: true,
                  cwd: 'css/',
                  src: ['*.css', '!*.min.css'],
                  dest: 'css',
                  ext: '.min.css'
              }]
          }
      },

      uglify: {
        options: {
            mangle: false
        },
        my_target: {
            files: {
                'js/app.min.js': ['js/app.js']
            }
        },
        my_second_target: {
            files: {
                'js/bootstrap.bundle.min.js': ['js/bootstrap.bundle.js']
            }
        },
    },


      concat: {
          options: {
              separator: ';',
          },
          css: {
              src: ['css/bootstrap.min.css','css/main.min.css' ],
              dest: 'css/prod.min.css',
          },
          js: {
              src: ['js/jquery.min.js', 'js/bootstrap.bundle.min.js','js/app.min.js'],
              dest: 'js/app.prod.min.js',
          },


      },

      watch: {
          scripts: {
              files: ['js/app.js','bootstrap.bundle.js'],
              tasks: ['uglify:my_target', 'concat'],
              options: {
                  event: ['all'],
                  interrupt: true,
                  livereload: true,
              },
          },
          css: {
              files: ['sass/main.scss','sass/bootstrap.scss'],
              tasks: ['sass','cssmin','concat'],
              options: {
                  livereload: true,
              },
          },
      },

      connect: {
        server: {
          options: {
              port: '9002',
              protocol: 'http',
              hostname: '0.0.0.0',
              base: ['public','www-root'],
              livereload: true,
              middleware: [
              function myMiddleware(req, res, next) {
                res.end();
              }
            ],
          },
        },
      },
      


  });


  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');


  grunt.registerTask('default', ['sass', 'cssmin', 'uglify', 'concat', 'watch']);

};