
var Middleware = require('courlan');

module.exports = {
	'/': function(req, res) {
		res.render('index');
	},
	'/profile': [
		Middleware.LoginRequired,
		function(req, res) {
			res.render('profile');
		}
	],
	'/signin': function(req, res) {
		res.render('signin');
	},
	'/signup': function(req, res) {
		res.render('signup');
	},
	'/signout': function(req, res) {

		var user = req.frex.Engine('User');

		user.signOut(function() {
			res.redirect('/');
			res.end();
		}, req.conn);
	},
	'/forget': function(req, res) {
		res.render('forget');
	},
	'/reset_password/:id/:token': function(req, res) {

		res.render('reset_password', {
			id: req.params.id,
			token: req.params.token
		});
	}
};
