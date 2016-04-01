module.exports = function(grunt) {

  grunt.initConfig({
    // watch: {
    //   js: {
    //     files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
    //     //tasks: ['jshint'],
    //     options: {
    //       livereload: true
    //     }
    //   },
    //   uglify: {
    //     files: ['public/**/*.js'],
    //     tasks: ['jshint'],
    //     options: {
    //       livereload: true
    //     }
    //   },
    // },
    nodemon: {
      dev: {
        options: {
          file: 'app.js',
          args: [],
          ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
          watchedExtensions: ['js'],
          watchedFolders: ['./'],
          debug: true,
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    },
    uglify: {
      my_target: {
        files: [{
          expand: true,
          cwd: 'assets',
          src: '**/*.js',
          dest: 'build_assets'
        }]
      }
    },
    cssmin: { 
      options : { 
          compatibility : 'ie8', //设置兼容模式 
          noAdvanced : true //取消高级特性 
      },
      minify: { 
          expand: true, 
          cwd: 'assets', //相对路径
          src: 'css/*.css', 
          dest: 'build_assets', 
          ext: '.css' 
      } 
    },

    concurrent: {//并行运行，加快构建速度
      tasks: ['nodemon', 'cssmin'],
      options: {
        logConcurrentOutput: true
      }
    }
  })

  //grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-concurrent');

  // grunt.loadNpmTasks('grunt-mocha-test')
  // grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  // grunt.loadNpmTasks('grunt-contrib-jshint')

  grunt.option('force', true)

  grunt.registerTask('default', ['uglify','cssmin','nodemon'])

  //grunt.registerTask('test', ['mochaTest'])
}