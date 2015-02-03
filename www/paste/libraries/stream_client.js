var paste_title = document.getElementById('paste-title');
var paste_data = document.getElementById('paste-data');

var webSocket = new WebSocket('ws://stacked.us:1921', 'client');

this.webSocket.onopen = function (event) {
	var connect_message = {
		type: 'connect',
		name: name, // global variable
	};
	webSocket.send(JSON.stringify(connect_message));
};

this.webSocket.onclose = function (event) {
};

this.webSocket.onmessage = function (event) {
	var message = JSON.parse(event.data);
	if (message.type === 'update') {
		name = message.name;
		update_paste(message.title, message.data);
	}
};

function update_paste(title, data) {
	paste_title.innerHTML = title;
	paste_data.innerHTML = remove_html_tags(data);
}