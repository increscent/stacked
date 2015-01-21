module.exports = function (app) {
	app.get('/:copy_name', function (req, res) {
		var name = req.params.copy_name;
		get_copy(app.models, name, function (result) {
			if (result) {
				send_paste(res, result.name, result.data, app.templating);
			} else {
				send_404(res, name, app.templating);
			}
		});
	});
};

function get_copy(models, name, callback) {
	models.copies.findOne({'name': name}, function (err, copy) {
		return callback(copy);
	});
}

function send_404(res, name, templating) {
	templating.renderHTML('www/404.html', {name: name}, function (result) {
		res.send(result);
	});
}

function send_paste(res, name, data, templating) {
	templating.renderHTML('www/paste.html', {name: name, data: data}, function (result) {
		res.send(result);
	});
}