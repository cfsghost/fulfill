"use strict";

var crypto = require('crypto');

var User = module.exports = function(frex, engine) {
	var self = this;
};

User.prototype.auth = function(username, password, callback, data) {
	var self = this;

	var engine = data.engine;
	var model = engine.database.model;
	var db = engine.database.db;
	var dbSettings = engine.database.settings;

	db.open(dbSettings.dbName)
		.collection(dbSettings.table)
		.model(model.schema)
		.where({
			email: username
		})
		.limit(1)
		.query(function(err, rows) {

			if (err) {
				callback(new Error('There is problem happened to user database'));
				return;
			}

			// Failed to authorize
			if (rows.length == 0) {
				callback(null, false);
				return;
			}

			// Get the first one
			var row = rows[0];

			// Failed if password is incorrect
			if (row.password != crypto.createHmac('sha256', password).digest('hex')) {
				callback(null, false);
				return;
			}

			// Initializing session
			data.req.session._id = row._id;
			data.req.session.name = row.name;
			data.req.session.email = row.email;

			callback(null, true);
		});
};

User.prototype.signOut = function(callback, data) {
	if (!data.req.session)
		data.req.session = {};

	data.req.session._id = null;
	data.req.session.name = null;
	data.req.session.username = null;
	data.req.session.email = null;

	callback(null);
};

User.prototype.isLogin = function(callback, data) {

	try {
		if (data.req.session.username) {

			callback(true);
			return;
		}

	} catch(e) {}

	callback(false);
};

User.prototype.getMyInfo = function(callback, data) {

	// Login is required
	if (!data.req.session.username) {
		callback(new Error('No permission to access'));
		return;
	}

	callback(null, {
		name: data.req.session.name,
		username: data.req.session.username,
		email: data.req.session.email
	});
};

User.prototype.getInfo = function(username, callback, data) {

	db.open(dbSettings.dbName)
		.collection(dbSettings.table)
		.model(model.schema)
		.where({
			username: username
		})
		.limit(1)
		.query(function(err, rows) {

			if (err) {
				callback(new Error('There is problem happened to user database'));
				return;
			}

			// No such user
			if (rows.length == 0) {
				callback(new Error('No such user'));
				return;
			}

			callback(null, {
				name: rows[0].name,
				email: rows[0].email,
				username: rows[0].username,
				created: rows[0].created
			});

		});
};

User.prototype.signUp = function(info, callback, data) {
	var self = this;

	var engine = data.engine;
	var model = engine.database.model;
	var db = engine.database.db;
	var dbSettings = engine.database.settings;
	var validator = data.req.validator;

	// Check display name
	validator.checkObject(info, 'displayname', {
		notEmpty: engine.statuscode.EMPTY
	}).notEmpty();

	// Check Email
	validator.checkObject(info, 'email', {
		isEmail: engine.statuscode.INVALID
	}).isEmail();

	// Check password
	validator.checkObject(info, 'password', {
		notEmpty: engine.statuscode.EMPTY
	}).notEmpty();

	var errors = validator.getObjectErrors();
	if (errors) {
		callback(new data.Error('FieldError', errors));
		return;
	}

	// Check whether email exists
	db.open(dbSettings.dbName)
		.collection(dbSettings.table)
		.model(model.schema)
		.select({
			id: 1
		})
		.where({
			email: info.email
		})
		.limit(1)
		.query(function(err, rows) {

			if (err) {
				callback(new data.Error('Failed', { code: engine.statuscode.SYSERR }));
				return;
			}

			if (rows.length) {
				callback(new data.Error('Failed', { code: engine.statuscode.EXISTS }));
				return;
			}


			// Write to database
			db.open(dbSettings.dbName)
				.collection(dbSettings.table)
				.model(model.schema)
				.insert({
					name: info.displayname,
					email: info.email,
					password: crypto.createHmac('sha256', info.password).digest('hex'),
					created: new Date().getTime()
				}, function(err, row) {

					if (err) {
						callback(new data.Error('Failed', { code: engine.statuscode.SYSERR }));
						return;
					}

					// Initializing session
					data.req.session._id = row._id;
					data.req.session.name = info.displayname;
					data.req.session.email = info.email;

					// Send information back
					callback(null, {
						_id: row._id,
						name: info.displayname,
						email: info.email
					});
				});
		});
};
