"use strict";

var DBHouse = require('dbhouse');

// Constructor
var constructor = function(engine, callback) {

	console.log('Initializing User engine ...');

	var dbHouse = engine.database.dbHouse;
	var model = engine.database.model;
	var dbSettings = engine.settings.database;

	// Connect to database
	dbHouse.connect(dbSettings.driver, { host: dbSettings.host, port: dbSettings.port }, function() {

		engine.database.db = new DBHouse.Database(dbHouse);

		// Create Index
		engine.database.db.open(dbSettings.dbName)
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
	database: require('./database'),
	statuscode: {
		SYSERR: -1,
		EMPTY: 0,
		INVALID: 1,
		EXISTS: 2,
		NONEXIST: 3,
		NOPERM: 4
	}
};
