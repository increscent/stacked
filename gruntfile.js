module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    watch: {
      html: {
        files: ['www/**/*.html']
      },
      js: {
        files: ['www/**/*.js']
      },
      css: {
        files: ['www/**/*.css']
      },
      options: {
        livereload: 1337
      }
    }
  });
  
  grunt.registerTask('default', [
    'watch'
  ]);
};