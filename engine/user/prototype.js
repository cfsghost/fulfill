"use strict";

var crypto = require('crypto');

var engine = null;

var User = module.exports = function(frex, _engine) {
	var self = this;

	engine = _engine;
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

User.prototype.resetPasswordWithToken = function(username, token, password, callback, data) {
	var self = this;

	if (!username || !token || !password) {
		callback(new data.Error('Failed', engine.statuscode.SYSERR));
		return;
	}

	var model = engine.database.model;
	var db = engine.database.db;
	var dbSettings = engine.database.settings;

	// Update password and clear token
	db.open(dbSettings.dbName)
		.collection(dbSettings.table)
		.model(model.schema)
		.where({
			email: username,
			token: token
		})
		.limit(1)
		.update({
			password: crypto.createHmac('sha256', password).digest('hex'),
			token: ''
		}, { return_new_data: true } ,function(err, rows) {

			if (err) {
				callback(new data.Error('Failed', engine.statuscode.SYSERR));
				return;
			}

			// Incorrect token or username doesn't exists
			if (!rows) {
				callback(new data.Error('Failed', engine.statuscode.INVALID));
				return;
			}

			callback(null);
		});
	
};

User.prototype.generateToken = function(username, callback) {
	var self = this;

	// Generate secure rendom token
	crypto.randomBytes(48, function(ex, buf) {
		var token = buf.toString('hex');

		var model = engine.database.model;
		var db = engine.database.db;
		var dbSettings = engine.database.settings;

		// Saving token
		db.open(dbSettings.dbName)
			.collection(dbSettings.table)
			.model(model.schema)
			.where({
				email: username
			})
			.limit(1)
			.update({
				token: token
			}, { return_new_data: true } ,function(err, rows) {

				if (err) {
					callback(new data.Error('Failed', engine.statuscode.SYSERR));
					return;
				}

				// username doesn't exists
				if (!rows) {
					callback(new data.Error('Failed', engine.statuscode.INVALID));
					return;
				}

				// TODO: send token to specific e-mail
				callback(null);
			});
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

	var model = engine.database.model;
	var db = engine.database.db;
	var dbSettings = engine.database.settings;
	var validator = data.req.validator;

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

			// No such user
			if (rows.length == 0) {
				callback(new Error('No such user'));
				return;
			}

			callback(null, {
				name: rows[0].name,
				email: rows[0].email,
				created: rows[0].created
			});

		});
};

User.prototype.signUp = function(info, callback, data) {
	var self = this;

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
				callback(new data.Error('Failed', engine.statuscode.SYSERR));
				return;
			}

			if (rows.length) {
				callback(new data.Error('Failed', engine.statuscode.EXISTS));
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
						callback(new data.Error('Failed', engine.statuscode.SYSERR));
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
