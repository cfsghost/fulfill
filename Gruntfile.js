var FrontendScript = require('./dev/frontend_script');

module.exports = function(grunt) {

	// Front-end scripts
	var frontendScript = new FrontendScript(grunt);
	frontendScript.viewScripts = {

		// Javascript for homepage
		'public/views/index.js': [ 'frontend/views/index.js' ],

		// JavaScript file for user pages
		'public/views/user/forget.js': [ 'frontend/views/user/forget.js' ],
		'public/views/user/profile.js': [ 'frontend/views/user/profile.js' ],
		'public/views/user/reset_password.js': [ 'frontend/views/user/reset_password.js' ],
		'public/views/user/signin.js': [ 'frontend/views/user/signin.js' ],
		'public/views/user/signup.js': [ 'frontend/views/user/signup.js' ],

		// JavaScript files for admin Pages
		'public/views/admin/index.js': [ 'frontend/views/admin/index.js' ]
	};
	frontendScript.updateSources();

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			view: {
				files: frontendScript.gruntSettings
			}
		},
		watch: {
			scripts: {
				files: frontendScript.watchScripts,
				tasks: 'uglify:view'
			},
			options: {
				nospawn: true
			}
		}
	});

	grunt.event.on('watch', function(action, filepath) {

		frontendScript.watch(action, filepath);
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('build', [
		'uglify:view'
	]);

	grunt.registerTask('debug', function() {
		var child = grunt.util.spawn({
			cmd: 'node',
			args: [ grunt.config('pkg.main') ]
		});

		child.stdout.pipe(process.stdout);
		child.stderr.pipe(process.stderr);

		grunt.task.run('watch');
	});
};
