/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    eslint: {
      target: ['Map*.js'],
      options: {
        config: '.eslintrc'
      }
    },
    jscs: {
      src: ['Map*.js'],
      options: {
        config: '.jscsrc'
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
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: '.',
          name: 'template.js',
          out: 'dist/famous-map.js',
          paths: {
            'famous': 'empty:',
            'famous-map': '.'
          },
          optimize: 'none'
        }
      }
    },
    browserify: {
      dist: {
        files: {
          './dist/famous-map-global.js': ['./template-global.js']
        },
        options: {
          transform: ['browserify-shim']
        }
      }
    },
    uglify: {
      noglobal: {
        src: './dist/famous-map.js',
        dest: './dist/famous-map.min.js'
      },
      global: {
        src: './dist/famous-map-global.js',
        dest: './dist/famous-map-global.min.js'
      }
    },
    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner:
            '/**\n' +
            '* This Source Code is licensed under the MIT license. If a copy of the\n' +
            '* MIT-license was not distributed with this file, You can obtain one at:\n' +
            '* http://opensource.org/licenses/mit-license.html.\n' +
            '*\n' +
            '* @author: Hein Rutjes (IjzerenHein)\n' +
            '* @license MIT\n' +
            '* @copyright Gloey Apps, 2014/2015\n' +
            '*\n' +
            '* @library famous-map\n' +
            '* @version ' + grunt.file.readJSON('package.json').version + '\n' +
            '* @generated <%= grunt.template.today("dd-mm-yyyy") %>\n' +
            '*/'
        },
        files: {
          src: ['dist/*.js']
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-jsdoc-to-markdown');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-banner');

  // Default task.
  grunt.registerTask('dist', ['requirejs', 'browserify', 'uglify', 'usebanner']);
  grunt.registerTask('default', ['eslint', 'jscs', 'jsdoc2md', 'dist']);
};
