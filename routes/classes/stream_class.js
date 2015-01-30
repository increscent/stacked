var streams = {};

var Stream = function (webSocket, app) {
	this.app = app;
	this.name;
	this.title;
	this.data;
	this.user_id;
	this.listeners = [];
	
	if (!webSocket) return this;
	
	var _this = this;
	webSocket.on('message', function (message) {
		message = JSON.parse(message);
		_this.handle_message(message, webSocket);
	});
	
	webSocket.on('close', function () {
		_this.close();
	});
	
	this.send_message = function (message) {
		webSocket.send(JSON.stringify(message));
	};
};

Stream.prototype.handle_message = function (message) {
	var _this = this;
	_this.user_id = message.user_id;
	
	if (message.type === 'update') {
		if (message.name === _this.name) {
			_this.update(message);
		} else {
			// if the name has changed
			_this.is_name_available(message.name, function (is_available) {
				if (is_available) {
					// if the stream was added already, remove it
					if (_this.exists()) delete streams[_this.name];
					// add the new stream
					_this.name = message.name;
					_this.add(message);
				} else {
					var error_message = {
						type: 'error',
						error: 'name_not_available',
						error_text: 'The name \'' + message.name + '\' is not available right now'
					};
					_this.send_message(error_message);
				}
			});
		}
	}
};

Stream.prototype.add = function (message) {
	streams[this.name] = this;
	this.update(message);
};

Stream.prototype.exists = function () {
	return (streams[this.name])? true : false;
};

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

Stream.prototype.get = function (name) {
	return streams[name];
};

Stream.prototype.update = function (message) {
	if (message.title) this.title = message.title;
	if (message.data) this.data = message.data;
	
	var success_message = {
		type: 'success',
		success: 'update',
		success_text: 'saved at <a target="_blank" href="/' + this.name + '">http://stacked.us/' + this.name + '</a>'
	};
	this.send_message(success_message);
};

Stream.prototype.close = function (app) {
	if (!this.exists()) return;
	
	var _this = this;
	var copy = new this.app.Copy(this.name, this.app);
	copy.save({title: this.title, data: this.data, user_id: this.user_id}, function (result) {
		delete streams[_this.name];
	});
};

module.exports = Stream;