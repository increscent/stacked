module.exports = function (app) {
	app.get('/:copy_id', function (req, res) {
		res.send(req.params.copy_id);
	});
};