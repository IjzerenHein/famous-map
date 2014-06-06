/*global module:false*/
module.exports = function(grunt) {

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
        src: ['./MapView.js', './MapItem.js'],
        dest: 'docs'
      },
      /*publish: {
        enabled: true,
        path: '<%= jsdox.generate.dest %>',
        message: 'Markdown Auto-Generated for version <%= pkg.version %>',
        remoteName: 'upstream',
        remoteBranch: 'master'
      }*/
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsdox');

  // Default task.
  grunt.registerTask('default', ['jshint', 'jsdox', 'qunit']);

};
