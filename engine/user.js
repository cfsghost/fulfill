"use strict";

var crypto = require('crypto');
var DBHouse = require('dbhouse');

var dbHouse = new DBHouse();
var db = null;

// Define schema
var userDatabaseSchema = new DBHouse.Schema({
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
});

// Index
var userDatabaseIndex = new DBHouse.Index([
    { fields: [ 'name' ] },
    { fields: [ 'username' ] },
    { fields: [ 'email' ] },
    { fields: [ 'created' ] }
]);

// Connect to database
dbHouse.connect('mongodb', { host: 'localhost', port: 27017 }, function() {

	db = new DBHouse.Database(dbHouse);

	// Create Index
    db.open('prototyper')
		.collection('users')
		.model(userDatabaseSchema, userDatabaseIndex)
		.createIndex();
});

var User = function() {
	var self = this;
};

User.prototype.auth = function(username, password, callback, data) {
	var self = this;

	db.open('prototyper')
		.collection('users')
		.model(userDatabaseSchema)
		.where({
			'$or': [ { username: username }, { email: username } ]
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
			data.req.session.username = row.username;
			data.req.session.email = row.email;

			callback(null, true);
		})
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

	db.open('prototyper')
		.collection('users')
		.model(userDatabaseSchema)
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
				projects: rows[0].projects,
				created: rows[0].created
			});

		});
};

User.prototype.getProjects = function(username, callback, data) {

	var project = data.req.frex.Engine('Project');

	db.open('prototyper')
		.collection('users')
		.model(userDatabaseSchema)
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

			// There is no project user have
			if (!rows[0].projects) {
				callback(null, []);
				return;
			}

			var projects = [];
			rows.parallel(5, function(projectID, index, arr, completed) {

				project.getInfoByID(projectID, function(err, info) {
					projects.push(info);

					completed();
				});
			}, function() {

				callback(null, projects);
			});
		});
	
};

User.prototype.appendProject = function(projectID, callback, data) {
	var self = this;

	// Login is required
	if (!data.req.session.username) {
		callback(new Error('No permission to access'));
		return;
	}

	var pjIDs = null;
	if (projectID instanceof Array) 
		pjIDs = projectID;
	else
		pjIDs = [ projectID ];

	db.open('prototyper')
		.collection('users')
		.model(userDatabaseSchema)
		.where({
			username: data.req.session.username
		})
		.update({
			'$pushAll': {
				projects: pjIDs
			}
		}, function(err) {
			if (err) {
				callback(err);
				return;
			}

			callback(null);
		});
};

User.prototype.signUp = function(info, callback, data) {
	var self = this;

	db.open('prototyper')
		.collection('users')
		.model(userDatabaseSchema)
		.insert({
			name: info.name,
			email: info.email,
			username: info.username,
			password: crypto.createHmac('sha256', info.password).digest('hex'),
			projects: [],
			created: new Date().getTime()
		}, function(err, row) {

			if (err) {
				callback(err);
				return;
			}

			// Initializing session
			data.req.session._id = row._id;
			data.req.session.name = info.name;
			data.req.session.username = info.username;
			data.req.session.email = info.email;

			callback(null, row);
		});
};

module.exports = {
	type: 'engine',
	engine_name: 'User',
	prototype: User
};
