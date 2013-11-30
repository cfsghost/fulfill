module.exports = {
	'/': function(req, res) {
		res.render('index');
	},
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
		}, { req: req, res: res });
	}
};
