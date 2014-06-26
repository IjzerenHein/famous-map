/*global module:false*/
module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['*.js', 'examples/panToPosition/*.js', 'test/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    },
    jsdox: {
      generate: {
        options: {
          contentsEnabled: false,
          contentsTitle: 'Example Documentation',
          contentsFile: 'readme.md',
        },
        src: ['./Map*.js'],
        dest: 'docs'
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: ".",
          name: 'MapMinify',
          out: "dist/famous-map.min.js",
          paths: {
            "famous": "empty:",
            "famous-map": '.'
          },
          optimize: 'uglify2',
          uglify: {
            mangler: {
              toplevel: true
            }
          },
        }
      }
    },
    jsdoc2md: {
      separateOutputFilePerInput: {
        options: {
          index: true
        },
        files: [
            { src: "MapView.js", dest: "docs/MapView.md" },
            { src: "MapUtility.js", dest: "docs/MapUtility.md" },
            { src: "MapModifier.js", dest: "docs/MapModifier.md" },
            { src: "MapStateModifier.js", dest: "docs/MapStateModifier.md" },
            { src: "MapTransition.js", dest: "docs/MapTransition.md" },
            { src: "MapPositionTransitionable.js", dest: "docs/MapPositionTransitionable.md" }
        ]
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks("grunt-jsdoc-to-markdown");

  // Default task.
  grunt.registerTask('default', ['jshint', 'jsdoc2md', 'requirejs']);
};
