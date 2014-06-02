module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    watch: {
      test: {
        files: ['src/**/*.js', 'test/spec/**/*.js'],
        tasks: ['test']
      },
      docs: {
        files: ['src/**/*.*'],
        tasks: ['ngdocs']
      }
    },

    jshint: {
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      },
      gruntfile: ['Gruntfile.js'],
      src: ['src/**/*.js'],
      spec: ['test/spec/**/*.js']
    },

    karma: {
      specWatch: {
        configFile: 'karma.conf.js',
        browsers: ['Chrome']
      },
      spec: {
        configFile: 'karma.conf.js',
        singleRun: true,
        autoWatch: false
      },
    },

    ngdocs: {
      options: {
        html5Mode: false,
        title: false,
        startPage: '/guide/00_installation',
        dest: 'dist-docs'
      },
      api: {
        src: [
          'docs/api/index.ngdoc',
          'src/sharepoint.js',
          'src/**/*.js',
        ],
        title: 'API Reference'
      },
      guide: {
        src: [
          'src/guide/**/*.ngdoc'
        ],
        title: 'Guide'
      }
    },

    connect: {
      docs: {
        options: {
          port: 9002,
          base: 'dist-docs',
          open: true,
          keepalive: true
        }
      }
    },

    ngmin: {
      dist: {
        expand: true,
        cwd: 'src',
        src: ['**/*.js'],
        dest: '.tmp'
      }
    },

    clean: {
      dist: [
        'dist/*.{js,map}'
      ],
      tmp: ['.tmp']
    },

    concat: {
      dist: {
        src: [
          '.tmp/sharepoint.js',
          '.tmp/services/*.js'
        ],
        dest: 'dist/angular-sharepoint.js'
      }
    },

    uglify: {
      dist: {
        options: {
          sourceMap: true
        },
        files: {
          'dist/angular-sharepoint.min.js': ['dist/angular-sharepoint.js']
        }
      }
    },

    bump: {
      options: {
        files: ['package.json', 'bower.json', 'dist/bower.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'bower.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
      }
    }

  });

  grunt.registerTask('test', [
    'karma:spec',
    'jshint'
  ]);

  grunt.registerTask('dev', function() {
    grunt.config.set(['jshint', 'options', 'force'], true);

    grunt.task.run([
      'test',
      'watch:test'
    ]);
  });

  grunt.registerTask('debug', ['karma:specWatch']);

  grunt.registerTask('docs', ['ngdocs', 'connect:docs']);

  grunt.registerTask('build', [
    'clean:tmp',
    'clean:dist',
    'ngmin:dist',
    'concat:dist',
    'uglify:dist'
  ]);

};
