
module.exports = function(grunt) {
 
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    banner: '/*! \n* <%= pkg.title || pkg.name %> - v<%= pkg.version %>' +
            '\n* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %> ' +
            '\n* <%= pkg.homepage ? pkg.homepage : "" %> ' +
            '\n*/ \n\n',

    paths: {
      app: {
        public: "www/",
        root: "src/app/",
        less: "src/app/styles/",
        html: "www/index.html"
      },
      vendor: {
        js: "src/vendor/scripts/",
        css: "src/vendor/styles/"
      },
      dist: {
        root: "src/dist/",
        appName: "app.js",
        appCSSName: "app.css",
        vendorName: "vendor.js",
        vendorCSSName: "vendor.css",
        exportJS: "www/js/",
        exportCSS: "www/css/"
      }
    },

    clean: {
      before: {
        src: [
          "<%= paths.dist.root %>*",
          "!<%= paths.dist.root %>.gitignore"
        ],
      }
    },

    less: {
      dev: {
        files: {
          "<%= paths.dist.exportCSS %><%= paths.dist.appCSSName %>": [ "<%= paths.app.less %>app.less" ]
        }
      },

      prod: {
        options: {
          yuicompress: true
        },
        files: {
          "<%= paths.dist %>css/app.css": [ "<%= paths.app.less %>app.less" ]
        }
      }

    },

    browserify: {
      app: {
        options:{
          extension: [ '.js' ]
        },
        src: ['<%= paths.app.root %>index.js'],
        dest: '<%= paths.dist.root %><%= paths.dist.appName %>'
      }
    },

    concat: {
      styles: {
        src: [
            '<%= paths.vendor.css %>**/*.css'
         ],
        dest: '<%= paths.dist.root %><%= paths.dist.vendorCSSName %>'
      },
      vendor: {
        options: {
          separator: ';',
        },
        src: [
            '<%= paths.vendor.js %>jquery.min.js'
          , '<%= paths.vendor.js %>**/*.js'
         ],
        dest: '<%= paths.dist.root %><%= paths.dist.vendorName %>'
      },
      app: {
        options: {
          stripBanners: {
            line: true
          },
          banner: '<%= banner %>',
        },
        files: {
          '<%= paths.dist.root %><%= paths.dist.appName %>': 
            [ '<%= paths.dist.root %><%= paths.dist.appName %>' ]
        }
      }
    },

    uglify: {
      all: {
        options: {
          stripBanners: {
            line: true
          },
          banner: '<%= banner %>',
        },
        files: {
          '<%= paths.dist.root %><%= paths.dist.appName %>':
            '<%= paths.dist.root %><%= paths.dist.appName %>',

          '<%= paths.dist.root %><%= paths.dist.vendorName %>':
            '<%= paths.dist.root %><%= paths.dist.vendorName %>',
        }
      }
    },

    copy: {
      dist: {
        cwd: "./", 
        files: {
          "<%= paths.dist.exportCSS %><%= paths.dist.vendorCSSName %>": 
            "<%= paths.dist.root %><%= paths.dist.vendorCSSName %>",

          "<%= paths.dist.exportJS %><%= paths.dist.vendorName %>": 
            "<%= paths.dist.root %><%= paths.dist.vendorName %>",

          "<%= paths.dist.exportJS %><%= paths.dist.appName %>": 
            "<%= paths.dist.root %><%= paths.dist.appName %>"
        }
      }

    },

    watch: {
      options: {
        livereload: 35729
      },
      local: {
        files: [
          "<%= paths.app.root %>**/*",
          "<%= paths.app.html %>"
        ],
        tasks: ['default'],
      },
      test: {
        files: ["router/api/**/*", "tests/api/**/*",
          "!<%= paths.app.root %>**/*"],
        tasks: ['test']
      }
    },

    jshint: {
      all: {
        files: {
          src: ["<%= paths.app.root %>**/*.js"]
        },
        options: {
          bitwise: true
          ,curly: true
          ,eqeqeq: true
          ,forin: true
          ,immed: true
          ,latedef: true
          ,newcap: true
          ,noempty: true
          ,nonew: true
          ,quotmark: false
          ,undef: true
          ,unused: true
          ,laxcomma: true

          ,globals: {
            window: true
            ,jQuery: true
            ,$: true
            ,require: true
            ,module: true
            ,console: true
            ,smoothScroll: true
          }
        }
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  var preBuild = [
    "clean:before", 
    "jshint:all", 
    "browserify", 
    "concat"
  ];

  var postBuild = [
    "copy"
  ];

  grunt.registerTask("default", preBuild.concat(["less:dev"]).concat(postBuild));
  grunt.registerTask("prod", preBuild.concat(["less:prod", "uglify"], postBuild));
  grunt.registerTask("w", ["default", "watch:local"]);

};
