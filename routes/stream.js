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
	
};

function send_response(res, response, error) {
	response.error = error;
	res.send(JSON.stringify(response));
}