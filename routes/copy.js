module.exports = function (app) {
	app.get('/', function (req, res) {
		app.templating.renderHTML('www/copy/copy.html', {css: '/copy/copy.css', html_title: 'new copy'}, function (result) {
			res.send(result);
		});
	});
	
	app.get('/stream', function (req, res) {
		app.templating.renderHTML('www/stream/stream.html', {css: '/stream/stream.css', html_title: 'stream files'}, function (result) {
			res.send(result);
		});
	});
	
	app.post('/save', function (req, res) {
		var name = req.body.name.toLowerCase();
		var title = req.body.title;
		var data = req.body.data;
		
		var copy = new app.Copy(name, app);
		copy.exists( function (exists) {
			if (!exists) {
				copy.save({name: name, title: title, data: data}, function (new_copy) {
					send_response(res, {data: new_copy}, !new_copy);
				});
			} else {
				send_response(res, {available: false}, true);
			}
		});
	});
	
	app.post('/is_copy_available', function (req, res) {
		var name = req.body.name.toLowerCase();
		
		var copy = new app.Copy(name, app);
		copy.exists( function (exists) {
			send_response(res, {available: !exists, name: name}, exists);
		});
	});
};

function send_response(res, response, error) {
	response.error = error;
	res.send(JSON.stringify(response));
}