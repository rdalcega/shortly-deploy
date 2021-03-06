module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    'string-replace': {
      dist: {
        files: {
          'views/layout.ejs': 'views/layout.ejs',
          'views/index.ejs': 'views/index.ejs'
        },
        options: {
          replacements: [

            {
              pattern: 'dependenciesDEV',
              replacement: 'dependenciesPROD'
            }

          ]
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    concat: {

      options: {
        separator: ';\n'
      },

      groupA: {
        dist: {
          src: ['public/client/*.js'],
          dest: 'public/dist/client.min.js'
        }
      },
      groupB: {
        dist: {
          src: ['public/lib/*.js'],
          dest: 'public/dist/lib.min.js'
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'public/dist/client.min.js': 'public/client/*.js',
          'public/dist/lib.min.js': [
            'public/lib/underscore.js',
            'public/lib/jquery.js',
            'public/lib/backbone.js',
            'public/lib/handlebars.js'
          ]
        }
      }
    },

    jshint: {
      files: [
        '**/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      target: {
        files: {
          'public/dist/style.min.css': 'public/style.css'
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      options: {
        stdout: true
      },
      prodServer: {
        command: [
        'npm install',
        'npm shrinkwrap',
        'git add .',
        'git commit -m "deploy"',
        'git push azure mongo'
        ].join(';')
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-string-replace');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'cssmin',
    'uglify',
    'string-replace'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run( [ 'shell' ] );
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
      //'jshint',
      //'mochaTest',
      'upload'
  ]);


};
