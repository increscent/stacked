module.exports = function (app) {
	app.use( function (req, res, next) {
		if (!req.cookies.id) {
			var uuid = app.uuid.v1();
			res.cookie('id', uuid);
			req.cookies.id = uuid;
		}
		req.user_id = req.cookies.id;
		next();
	});
};