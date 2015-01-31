module.exports = function (app) {
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
	webSocket.on('message', function (message) {
		message = JSON.parse(message);
		if (message.type === 'connect') {
			var name = message.name;
			var stream = new app.Stream(undefined, app);
			var source_stream = stream.get(name);
			source_stream.add_listener(webSocket);
		}
	});
};

function send_response(res, response, error) {
	response.error = error;
	res.send(JSON.stringify(response));
}