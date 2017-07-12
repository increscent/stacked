// This file handles the websocket connections from the server start_index

// Global variable that stores all the open streams
var streams = {};

// Custom class that defines a client connection to create/edit a copy
var Stream = function (webSocket, app, uri) {
	this.app = app;
	app.streams = streams; // Maybe not necessary to do this every time?
	this.uri = app.shortid.generate();
	this.title = '';
	this.data = '';
	this.file_path;
	this.file_name;
	this.copy_type = 'TEXT';
	this.user_id;
	this.listeners = {}; // These are connections that see live updates to the copy
	this.webSocket = webSocket;

	if (!webSocket) return this; // If there's no connection then the rest of the constructor is not necessary

	var _this = this;
	webSocket.on('message', function (message) {
		message = JSON.parse(message);
		_this.handle_message(message, webSocket);
	});

	webSocket.on('close', function () {
		_this.close();
	});

	// save every minute
	this.save_interval = setInterval( function () {
		if (_this.title || _this.data) _this.save( function () {});
	}, 60000);

	// initialize the connection with a uri
	this.send_uri();

	// add this stream to the list
	streams[this.uri] = this;
};

// Function to send a message
Stream.prototype.send_message = function (message) {
	this.webSocket.send(JSON.stringify(message));
};

// Function to receive message
Stream.prototype.handle_message = function (message) {
	var _this = this;
	_this.user_id = message.user_id;

	switch (message.request_type) {
		case 'update':
			_this.update(message);
			break;
		case 'get_uri':
			_this.send_uri();
			break;
	};
};

// Get any stream
Stream.prototype.get = function (uri) {
	return streams[uri];
};

// Process an update from the client
Stream.prototype.update = function (message) {
	this.title = this.app.htmlencode(message.title);
	if (this.copy_type == 'TEXT') this.data = this.app.htmlencode(message.data);

	// Make sure everyone listening gets the update
	for (var key in this.listeners) {
		this.send_to_client(this.listeners[key]);
	}
};

// Internal process to update the file information
Stream.prototype.file_update = function (file_path, file_name) {
	this.copy_type = 'FILE';
	this.file_path = file_path;
	this.file_name = file_name;
	this.data = '<a href="/download/' + this.uri + '" download>' + this.file_name + '</a>';
	this.update({});
}

// Let the client know what the uri is (it's assigned by the server)
Stream.prototype.send_uri = function () {
	var uri_message = {
		request_type: 'get_uri',
		uri: this.uri
	};
	this.send_message(uri_message);
};

// Someone new wants to see the copy in real time
Stream.prototype.add_listener = function (webSocket) {
	webSocket.random_id = this.app.uuid.v1();
	this.listeners[webSocket.random_id] = webSocket;
	var _this = this;
	webSocket.on('close', function () {
		delete _this.listeners[webSocket.random_id];
	});
};

// Send an updated message to the listening clients
Stream.prototype.send_to_client = function (webSocket) {
	var message = {
		request_type: 'update',
		title: this.title,
		data: this.data
	};

	webSocket.send(JSON.stringify(message));
};

// Save in MongoDB, stop the save interval, destroy all evidence
Stream.prototype.close = function () {
	var _this = this;
	this.save( function () {
		clearInterval(_this.save_interval);
		delete streams[_this.uri];
	});
};

// Put the copy into MongoDB for safe keeping
Stream.prototype.save = function (callback) {
	var _this = this;
	var copy = new this.app.Copy(this.uri, this.app);
	copy.get( function (result) {
		if (!result) result = {};
		result.uri = _this.uri;
		result.title = _this.title;
		result.data = _this.data;
		result.file_path = _this.file_path;
		result.user_id = _this.user_id;
		result.type = _this.copy_type;
		result.timestamp = Date.now();

		copy.save(result, callback);
	});
};

module.exports = Stream;

/* This function is not currently necessary, but may be in the future
Stream.prototype.is_name_available = function (name, callback) {
	var copy = new this.app.Copy(name, this.app);
	var _this = this;
	copy.exists( function (copy_exists) {
		if (!_this.get(name) && (!copy_exists || copy_exists.user_id == _this.user_id)) {
			return callback(true);
		} else {
			return callback(false);
		}
	});
};
*/
