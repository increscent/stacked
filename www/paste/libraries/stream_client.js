var paste_title = document.getElementById('paste-title');
var paste_data = document.getElementById('paste-data');

var webSocket = new WebSocket(websocket_uri, 'client');

this.webSocket.onopen = function (event) {
	var connect_message = {
		request_type: 'connect',
		uri: uri, // global variable
	};
	webSocket.send(JSON.stringify(connect_message));
};

this.webSocket.onclose = function (event) {
};

this.webSocket.onmessage = function (event) {
	var message = JSON.parse(event.data);
	if (message.request_type === 'update') {
		update_paste(message.title, message.data);
	}
};

function update_paste(title, data) {
	paste_title.innerHTML = title;
	paste_data.innerHTML = data;
}
