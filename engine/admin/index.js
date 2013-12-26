"use strict";

var DBHouse = require('dbhouse');

// Metadata
module.exports = {
	type: 'engine',
	engine_name: 'Admin',
	prototype: require('./prototype'),
	statuscode: {
		SYSERR: -1,
		EMPTY: 0,
		INVALID: 1,
		EXISTS: 2,
		NONEXIST: 3,
		NOPERM: 4
	},
	check_permission: function(conn, callback) {

		if (!conn.req.session.username)
			callback(false);

		if (!conn.req.session.permission)
			callback(false);

		if (conn.req.session.permission.admin) {
			callback(true);
		} else {
			callback(false);
		}
	}
};
