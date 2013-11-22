"use strict";

var path = require('path');
var Frex = require('frex.js');
var ConfigManager = require('./lib/config_manager');

var app = Frex();

app.configure(function() {

	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(function(req, res, next) {
		res.locals.configs = app.locals.configs;
		next();
	});
	app.use(app.router);
	app.use(Frex.static(__dirname + '/public'));
});

// Loading configuration files
var configManager = new ConfigManager(path.join(__dirname, 'configs'));
configManager.load(function(err, configs) {
	app.locals.configs = configs;

	app.listen(app.locals.configs.app.port, function() {
		console.log('website is ready.');
	});
});
