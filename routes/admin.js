
var Middleware = require('courlan');

module.exports = {
	'/admin': [
		Middleware.AdminRequired,
		function(req, res) {
			res.render('admin/index');
		}
	]
};
