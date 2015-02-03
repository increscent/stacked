/* class to facilitate client/server communication */

var Stream = function () {
	this.webSocket = new WebSocket('ws://stacked.us:1921', 'source');
	this.on_error;
	this.on_success;
	this.is_open = false;
	
	var _this = this;
	this.webSocket.onopen = function (event) {
		_this.is_open = true;
	};
	this.webSocket.onclose = function (event) {
		_this.is_open = false;
	};
	this.webSocket.onmessage = function (event) {
		var message = JSON.parse(event.data);
		_this.handle_message(message);
	};
};

Stream.prototype.send_update = function (name, title, data) {
	var message = {
		name: name,
		title: title,
		data: data,
		type: 'update',
		user_id: get_cookie('id')
	};
	
	if (this.is_open) {
		this.webSocket.send(JSON.stringify(message));
	}
};

Stream.prototype.handle_message = function (message) {
	if (message.type === 'error') {
		this.on_error(message);
	} else if (message.type === 'success') {
		this.on_success(message);
	}
};

Stream.prototype.close = function () {
	this.webSocket.close();
	this.is_open = false;
};

function get_cookie(name) {
	var id = name + '=';
	var start_index = document.cookie.indexOf(id);
	if (start_index < 0) return '';
	start_index += id.length;
	var end_index = document.cookie.indexOf(';', start_index);
	if (end_index < 0) end_index = document.cookie.length;
	return document.cookie.substring(start_index, end_index);
}