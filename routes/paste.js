module.exports = function (app) {
	app.get('/:copy_name', function (req, res) {
		var name = req.params.copy_name;
		get_copy(app.models, name, function (result) {
			if (result) {
				send_paste(res, result, app.templating);
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
	templating.renderHTML('www/404/404.html', {name: name, css: '/404/404.css', html_title: 'not found'}, function (result) {
		res.send(result);
	});
}

function send_paste(res, replace_object, templating) {
	templating.renderHTML('www/paste/paste.html', {name: replace_object.name, html_title: '`title`', title: replace_object.title, data: replace_object.data, css: '/paste/paste.css'}, function (result) {
		res.send(result);
	});
}