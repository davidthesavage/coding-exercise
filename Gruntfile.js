module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    sass: {
      dist: {
        files: {
          'dist/styles.css': 'views/styles.sass'
        }
      }
    },
    watch: {
      sass: {
        files: ['views/styles.sass'],
        tasks: ['sass'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.registerTask('default', ['sass', 'watch']);
}