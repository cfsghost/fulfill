"use strict";

var DBHouse = require('dbhouse');

// Define schema
var model = {

	schema: new DBHouse.Schema({
		_id: { type: 'UUID' },
		name: { type: 'String' },
		email: { type: 'String' },
		password: { type: 'String' },
		token: { type: 'String' },
		created: { type: 'Date' }
	}),
	index: new DBHouse.Index([
	    { fields: [ 'name' ] },
	    { fields: [ 'email' ] },
	    { fields: [ 'created' ] }
	])
};

module.exports = {
	dbHouse: new DBHouse(),
	model: model,
	db: null
};
