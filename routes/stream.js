module.exports = function (app) {
	app.post('/is_stream_available', function (req, res) {
		var name = req.body.name.toLowerCase();
		
		var copy = new app.Copy(name, app);
		copy.exists( function (exists) {
			var stream = new app.Stream(undefined, app);
			exists = exists || stream.get(name);
			send_response(res, {available: !exists, name: name}, exists);
		});
	});
	
	app.webSocket.on('connection', function (ws) {
		if (ws.protocol === 'source') {
			source_connection(ws, app);
		} else {
			client_connection(ws, app);
		}
	});
};

var source_connection = function (webSocket, app) {
	var stream = new app.Stream(webSocket, app);
};

var client_connection = function (webSocket, app) {
	
};

function send_response(res, response, error) {
	response.error = error;
	res.send(JSON.stringify(response));
}