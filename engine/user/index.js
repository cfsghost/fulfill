"use strict";

var DBHouse = require('dbhouse');

// Constructor
var constructor = function(engine, callback) {

	console.log('Initializing User engine ...');

	var dbHouse = engine.database.dbHouse;
	var model = engine.database.model;
	var db = engine.database.db;
	var dbSettings = engine.database.settings;

	// Connect to database
	dbHouse.connect(dbSettings.driver, { host: dbSettings.host, port: dbSettings.port }, function() {

		db = new DBHouse.Database(dbHouse);

		// Create Index
		db.open(dbSettings.dbName)
			.collection(dbSettings.table)
			.model(model.schema, model.index)
			.createIndex();

		callback();
	});
};

// Metadata
module.exports = {
	type: 'engine',
	engine_name: 'User',
	prototype: require('./prototype'),
	constructor: constructor,
	database: require('./database')
};
