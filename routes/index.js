module.exports = {
	'/': function(req, res) {
		res.render('index');
	},
	'/signin': function(req, res) {
		res.render('signin');
	},
	'/signup': function(req, res) {
		res.render('signup');
	}
};
