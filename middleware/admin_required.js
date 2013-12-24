"use strict";

module.exports = {
	name: 'AdminRequired',
	middleware: function(req, res, next) {
		if (req.session.permission.admin) {
			next();
			return;
		}

		res.status(404);
		res.end('404 Not Found');
	}
};
