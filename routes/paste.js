module.exports = function (app) {
	app.get('/:copy_name', function (req, res) {
		var name = req.params.copy_name.toLowerCase();
		// check if paste is in streams
		var stream = new app.Stream(undefined, app);
		stream = stream.get(name);
		if (stream) {
			stream.stream_client = '<script src="/paste/stream_client.js"></script>';
			send_paste(res, stream, app.templating);
			return;
		}
		// then check if it is in the db
		var copy = new app.Copy(name, app);
		copy.get( function (result) {
			if (result) {
				send_paste(res, result, app.templating);
			} else {
				send_404(res, name, app.templating);
			}
		});
	});
};

function send_404(res, name, templating) {
	templating.renderHTML('www/404/404.html', {name: name, css: '/404/404.css', html_title: 'not found'}, function (result) {
		res.send(result);
	});
}

function send_paste(res, replace_object, templating) {
	templating.renderHTML('www/paste/paste.html', {name: replace_object.name, html_title: '`title`', title: replace_object.title, data: replace_object.data, css: '/paste/paste.css', stream_client: replace_object.stream_client}, function (result) {
		res.send(result);
	});
}