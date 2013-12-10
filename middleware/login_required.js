"use strict";

module.exports = {
	name: 'LoginRequired',
	middleware: function(req, res, next) {
		if (req.session.email) {
			next();
			return;
		}

		res.status(404);
		res.end('404 Not Found');
	}
};
