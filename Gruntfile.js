/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    eslint: {
      target: ['*.js'],
      options: {
        config: '.eslintrc'
      }
    },
    jscs: {
        src: ['*.js'],
        options: {
            config: '.jscsrc'
        }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: '.',
          name: 'MapMinify',
          out: 'dist/famous-map.min.js',
          paths: {
            'famous': 'empty:',
            'famous-map': '.'
          },
          optimize: 'uglify2',
          uglify: {
            mangler: {
              toplevel: true
            }
          }
        }
      }
    },
    jsdoc2md: {
      separateOutputFilePerInput: {
        options: {
          index: true
        },
        files: [
            { src: 'MapView.js', dest: 'docs/MapView.md' },
            { src: 'MapUtility.js', dest: 'docs/MapUtility.md' },
            { src: 'MapModifier.js', dest: 'docs/MapModifier.md' },
            { src: 'MapStateModifier.js', dest: 'docs/MapStateModifier.md' },
            { src: 'MapTransition.js', dest: 'docs/MapTransition.md' },
            { src: 'MapPositionTransitionable.js', dest: 'docs/MapPositionTransitionable.md' }
        ]
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-jsdoc-to-markdown');

  // Default task.
  grunt.registerTask('default', ['eslint', 'jscs', 'jsdoc2md', 'requirejs']);
};
