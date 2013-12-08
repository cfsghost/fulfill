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

		// Configuring engines
		app.frex.setEngine('User', {
			database: {
				driver: 'mongodb',
				host: 'localhost',
				port: 27017,
				dbName: 'fulfill',
				table: 'user'
			},
			service: {
				service_name: configs.app.service_name,
				server_host: configs.app.server_host,
				port: configs.app.port
			},
			mailer: configs.app.mailer
		});

		// Template engine
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
