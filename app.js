"use strict";

var path = require('path');
var Frex = require('frex.js');
var ConfigManager = require('./lib/config_manager');
var Validator = require('./lib/validator');

var app = Frex();

// Loading configuration files
var configManager = new ConfigManager(path.join(__dirname, 'configs'));
configManager.load(function(err, configs) {

	app.locals.configs = configs;

	// Configuring
	app.configure(function() {

		app.set('views', __dirname + '/views');
		app.set('view engine', 'jade');
		app.use(function(req, res, next) {
			res.locals.configs = app.locals.configs;
			next();
		});

		// Session
		app.use(Frex.cookieParser());
		app.use(Frex.cookieSession({
			key: 'fulfill',
			secret: app.locals.configs.app.secret_key
		}));
		app.use(function(req, res, next) {
			res.locals.session = req.session;
			next();
		});

		// Validator
		app.use(function(req, res, next) {

			req.validator = new Validator();

			next();
		});

		app.use(app.router);
		app.use(Frex.static(__dirname + '/public'));
	});

	app.listen(app.locals.configs.app.port, function() {
		console.log('website is ready.');
	});
});
