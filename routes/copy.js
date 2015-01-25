module.exports = function (app) {
	app.get('/', function (req, res) {
		app.templating.renderHTML('www/copy/copy.html', {}, function (result) {
			res.send(result);
		});
	});
	
	app.post('/save', function (req, res) {
		var data = req.body.data;
		var name = req.body.name;
		
		is_name_available(app.models, name, function (result) {
			if (result) {
				save_copy(app.models, name, data, function (result) {
					send_response(res, {}, result);
				});
			} else {
				send_response(res, {available: false}, true);
			}
		});
	});
	
	app.post('/is_name_available', function (req, res) {
		var name = req.body.name;
		is_name_available(app.models, name, function (result) {
			send_response(res, {available: result}, !result);
		});
	});
};

function is_name_available(models, name, callback) {
	models.copies.findOne({'name': name}, function (err, copy) {
		return (copy)? callback(false) : callback(true);
	});
}

function save_copy(models, name, data, callback) {
	var copy = new models.copies({
		name: name,
		data: data,
		markModified: 'data'
	});
	
	copy.save( function (err, newCopy) {
		if (err)
			return callback(true);
		else
			return callback(false);
	});
}

function send_response(res, response, error) {
	response.error = error;
	res.send(JSON.stringify(response));
}