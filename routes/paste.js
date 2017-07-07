module.exports = function (app) {
	app.get('/:uri', function (req, res) {
		var uri = req.params.uri;
		// check if paste is in streams
		var stream = new app.Stream(undefined, app);
		stream = stream.get(uri);
		if (stream) {
			stream.stream_client = '<script src="/paste/libraries/stream_client.js"></script>';
			send_paste(res, stream, app.templating);
			return;
		}
		// then check if it is in the db
		var copy = new app.Copy(uri, app);
		copy.get( function (result) {
			if (result) {
				send_paste(res, result, app.templating);
			} else {
				send_404(res, uri, app.templating);
			}
		});
	});

	// No longer needed
	/*app.get('/raw/:copy_name', function (req, res) {
		var name = req.params.copy_name.toLowerCase();
		// check if paste is in streams
		var stream = new app.Stream(undefined, app);
		stream = stream.get(name);
		if (stream) {
			send_raw(res, stream.data, stream.file_type);
			return;
		}
		// then check if it is in the db
		var copy = new app.Copy(name, app);
		copy.get( function (result) {
			if (result) {
				send_raw(res, result.data, result.file_type);
			} else {
				send_404(res, name, app.templating);
			}
		});
	});*/
};

function send_404(res, uri, templating) {
	templating.renderHTML('www/404/404.html', {uri: uri, css: '/404/404.css', html_title: 'not found'}, function (result) {
		res.send(result);
	});
}

function send_paste(res, replace_object, templating) {
	//if (replace_object.type == 'TEXT' || replace_object.copy_type == 'TEXT') replace_object.data = remove_html_tags(replace_object.data); // could be from stream or MongoDB
	templating.renderHTML('www/paste/paste.html', {uri: replace_object.uri, html_title: '`title`', title: replace_object.title, data: replace_object.data, css: '/paste/paste.css', stream_client: replace_object.stream_client}, function (result) {
		res.send(result);
	});
}

/* This is no longer necessary
function remove_html_tags(data) {
	data = data.replace(new RegExp('<', 'g'), '&lt;');
	data = data.replace(new RegExp('>', 'g'), '&gt;');
	return data;
}
*/

/* This is no longer necessary
function send_raw(res, data, file_type) {
	//res.setHeader("Access-Control-Allow-Origin", "*");
  //res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader("Content-Type", file_type);

	res.writeHead(200, {'Content-Length': Buffer.byteLength(data)}, {'Content-Type': file_type});
	res.end(data);
}
*/
