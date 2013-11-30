"use strict";

var crypto = require('crypto');
var DBHouse = require('dbhouse');

var dbSettings = {
	driver: 'mongodb',
	host: 'localhost',
	port: '27017',
	dbName: 'fulfill',
	table: 'user'
};


// Define schema
var model = {

	schema: new DBHouse.Schema({
		_id: { type: 'UUID' },
		name: { type: 'String' },
		username: { type: 'String' },
		email: { type: 'String' },
		password: { type: 'String' },
		projects: {
			type: 'Array',
			subtype: 'UUID'
		},
		created: { type: 'Date' }
	}),
	index: new DBHouse.Index([
	    { fields: [ 'name' ] },
	    { fields: [ 'username' ] },
	    { fields: [ 'email' ] },
	    { fields: [ 'created' ] }
	])
};

module.exports = {
	dbHouse: new DBHouse(),
	settings: dbSettings,
	model: model,
	db: null
};
