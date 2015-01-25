module.exports = function (app) {
	app.get('/', function (req, res) {
		app.templating.renderHTML('www/copy/copy.html', {css: '/copy/copy.css', html_title: 'new copy'}, function (result) {
			res.send(result);
		});
	});
	
	app.post('/save', function (req, res) {
		var data = req.body.data;
		var name = req.body.name;
		var title = req.body.title;
		
		is_name_available(app.models, name, function (result) {
			if (result) {
				save_copy(app.models, name, title, data, function (result) {
					send_response(res, {data: result}, !result);
				});
			} else {
				send_response(res, {available: false}, true);
			}
		});
	});
	
	app.post('/is_name_available', function (req, res) {
		var name = req.body.name.toLowerCase();
		is_name_available(app.models, name, function (result) {
			send_response(res, {available: result, name: name}, !result);
		});
	});
};

function is_name_available(models, name, callback) {
	models.copies.findOne({'name': name}, function (err, copy) {
		return (copy)? callback(false) : callback(true);
	});
}

function save_copy(models, name, title, data, callback) {
	var copy = new models.copies({
		name: name,
		title: title,
		data: data,
		markModified: 'data'
	});
	
	copy.save( function (err, newCopy) {
		if (err)
			return callback(false);
		else
			return callback(newCopy);
	});
}

function send_response(res, response, error) {
	response.error = error;
	res.send(JSON.stringify(response));
}