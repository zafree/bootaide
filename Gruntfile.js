/*!
 * Bootaide's Gruntfile
 * http://zafree.github.io/bootaide
 * Copyright 2014-2015 Zafree
 * Licensed under MIT (https://github.com/zafree/bootaide/blob/master/LICENSE)
 */

module.exports = function(grunt) {
  'use strict';
  
  // Load Grunt tasks declared in the package.json file
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	banner: '/*!\n' +
            ' * Bootaide v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
            ' */\n',
    
	express: {
	    all: {
	        options: {
	            bases: ['.'],
	            port: 9090,
	            hostname: "localhost",
	            livereload: true
	        }
	    }
	},
    
	open: {
	    all: {
	        path: 'http://localhost:9090/'
	    }
	},
	
	concat: {
    	options: {
	      banner: '<%= banner %>\n',
	      separator: ';',
	    },
	    dist: {
	      src: ['js/**.js'],
	      dest: 'dist/js/<%= pkg.name %>.js'
	    },
	},
	
    cssmin: {
    	options: {
	        banner: '<%= banner %>\n',
	    },
    	dist: {
	        src: ['dist/css/<%= pkg.name %>.css'],
	        dest: 'dist/css/<%= pkg.name %>.min.css'
	    }
    },
      
    less: {
    	options: {
	        banner: '<%= banner %>\n',
	    },
		development: {
		    options: {
		      paths: ["dist/css"]
		    },
		    files: {
		      "dist/css/<%= pkg.name %>.css": "less/<%= pkg.name %>.less"
		    }
		},
    	build: {
    	  src: ['less/<%= pkg.name %>.less'],
	      dest: 'dist/css/<%= pkg.name %>.css'
		}
	},
    
    uglify: {
		options: {
	        banner: '<%= banner %>',
	    },
	    dist: {
	        src: ['dist/js/<%= pkg.name %>.js'],
	        dest: 'dist/js/<%= pkg.name %>.min.js'
	    }
    },
    
        
	watch: {
		less: {
			files: 'less/**/*.less',
			tasks: ['less']
		},
		cssmin: {
			files: 'less/**/*.less',
			tasks: ['cssmin']
		},		
		concat: {
			files: 'js/*.js',
			tasks: ['concat']
		},		
		uglify: {
			files: 'js/*.js',
			tasks: ['uglify']
		},
		all: {
	        files: '**/*.html',
	        options: {
	            livereload: true
	        }
	    }
	}
  });

  // Load the plugin that provides the task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express');

  // Default task(s).
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['less','cssmin','concat','uglify']);
  
  // Creates the `server` task
  grunt.registerTask('serve', ['express','open','watch']);

};