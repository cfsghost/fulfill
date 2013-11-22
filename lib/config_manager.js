"use strict";

var fs = require('fs');
var path = require('path');
var async = require('async');

var ConfigManager = module.exports = function(configDir) {
	var self = this;

	self.configDir = configDir || path.join(__dirname, '..', 'configs');
};

ConfigManager.prototype.load = function(callback) {
	var self = this;

	if (!callback)
		return;

	fs.readdir(self.configDir, function(err, files) {
		if (err) {
			callback(err);
			return;
		}

		var config = {};

		async.eachSeries(files, function(filename, next) {

			// Only read JSON file
			if (path.extname(filename) != '.json') {
				next();
				return;
			}

			fs.readFile(path.join(self.configDir, filename), function(err, raw) {

				if (err) {
					next();
					return;
				}

				// Parsing config file
				try {
					var settings = JSON.parse(raw.toString());
				} catch(e) {
					next();
					return;
				}

				var domain = path.basename(filename, '.json');
				config[domain] = settings;

				next();
			});
		}, function(err) {

			callback(err, config);
		});
	});
};
