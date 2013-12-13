"use strict";

var path = require('path');
var Frex = require('frex.js');
var Courlan = require('courlan');
var ConfigManager = require('./lib/config_manager');
var Validator = require('./lib/validator');

var app = Frex();

// Loading configuration files
var configManager = new ConfigManager(path.join(__dirname, 'configs'));
configManager.load(function(err, configs) {

	app.locals.configs = configs;

	// Loading middlewares
	Courlan(path.join(__dirname, 'middleware'), function() {

		// Configuring
		app.configure(function() {

			// Configuring engines
			app.frex.setEngine('User', {
				database: {
					driver: configs.app.database.type,
					host: configs.app.database.host,
					port: configs.app.database.port,
					dbName: configs.app.database.dbName,
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
				secret: configs.app.secret_key
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

		app.listen(configs.app.port, function() {
			console.log('website is ready.');
		});
	});
});
