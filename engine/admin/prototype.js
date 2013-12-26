"use strict";

var Admin = module.exports = function() {
	var self = this;
};

Admin.prototype.listUsers = function(condition, callback) {
	var self = this;

	var user = Admin.frex.getMetadata('User');
	var model = user.database.model;
	var db = user.database.db;
	var dbSettings = user.settings.database;

	db.open(dbSettings.dbName)
		.collection(dbSettings.table)
		.model(model.schema)
		.select({
			password: false
		})
		.where({})
		.query(function(err, rows) {

			if (err) {
				callback(new Admin.frex.Error('There is problem happened to user database'));
				return;
			}

			// No results
			if (rows.length == 0) {
				callback(null, []);
				return;
			}

			callback(null, rows);
		});
};

Admin.prototype.updateUser = function(id, info, callback) {
	var self = this;

	var user = Admin.frex.getMetadata('User');
	var model = user.database.model;
	var db = user.database.db;
	var dbSettings = user.settings.database;

	// Modify info
	db.open(dbSettings.dbName)
		.collection(dbSettings.table)
		.model(model.schema)
		.where({
			_id: id
		})
		.limit(1)
		.update(info, { return_new_data: true } ,function(err, rows) {

			if (err) {
				callback(new User.frex.Error('Failed', engine.statuscode.SYSERR));
				return;
			}

			// this user doesn't exists
			if (!rows) {
				callback(new User.frex.Error('Failed', engine.statuscode.INVALID));
				return;
			}

			callback(null);
		});
};
