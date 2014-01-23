"use strict";

var fs = require('fs');
var path = require('path');

var FrontendScript = module.exports = function(grunt) {
	var self = this;

	self.grunt = grunt;
	self.gruntSettings = {};
	self.sourceDir = 'frontend';
	self.destDir = 'public';
	self.viewScripts = {};
	self.watchScripts = [];
};

FrontendScript.prototype.updateSources = function() {
	var self = this;

	for (var filepath in self.viewScripts) {
		var sources = self.prepareSources(self.viewScripts[filepath]);

		self.gruntSettings[filepath] = sources;
	}
};

FrontendScript.prototype.prepareSources = function(srcList) {
	var self = this;

	var sources = [];
	for (var index in srcList) {
		var filepath = srcList[index];

		if (fs.existsSync(filepath)) {
			// Try to scan files in the directory.
			if (fs.lstatSync(filepath).isDirectory()) {
				sources = sources.concat(self.scanFiles(filepath));

				self.watchScripts.push(path.join(filepath, '*.js'));
			} else {
				// It is source code file, add to list
				sources.push(filepath);

				self.watchScripts.push(filepath);
			}
		}
	}

	return sources;
};

FrontendScript.prototype.scanFiles = function(filepath) {
	var self = this;

	var subFiles = [];
	var curFiles = [];
	var files = fs.readdirSync(filepath);
	for (var filename in files) {

		var realPath = path.join(filepath, filename);

		// It is directory, just scanning it.
		if (fs.lstatSync(realPath).isDirectory()) {
			subFiles = subFiles.concat(self.scanFiles(realPath));

			self.watchScripts.push(path.join(realPath, '*.js'));
		} else {
			curFiles.push(realPath);
		}
	}

	return curFiles.concat(subFiles);
}

FrontendScript.prototype.watch = function(action, filepath) {
	var self = this;

	// Finding which group this file belongs to
	var dest = null;
	var src = null;
	for (var destPath in self.viewScripts) {
		if (self.viewScripts[destPath].indexOf(filepath) != -1 ) {
			dest = destPath;
			src = self.viewScripts[destPath];
			break;
		}
	}

	if (dest && src) {

		// Update the config file to only build the changed file.
		self.grunt.config('uglify.view.files', [
			{
				src: src,
				dest: dest
			}
		]);
	}
};
