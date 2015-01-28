var streams = {};

var Stream = function (webSocket, app, user_id) {
	this.app = app;
	this.user_id = user_id;
	this.name;
	this.title;
	this.data;
	this.listeners = [];
	
	if (!webSocket) return this;
	
	var _this = this;
	webSocket.on('message', function (message) {
		message = JSON.parse(message);
		if (message.type === 'add') {
			// make sure there is not already a copy with the same name
			_this.is_name_available(message.name, function (is_available) {
				if (is_available) {
					_this.add(message);
				} else {
					webSocket.send('name_not_available');
				}
			});
		} else if (message.type === 'update') {
			if (_this.exists()) {
				_this.update(message);
			}
		} else if (message.type === 'is_name_available') {
			_this.is_name_available(message.name, function (is_available) {
				if (is_available) {
					webSocket.send('name_is_available');
				} else {
					webSocket.send('name_not_available');
				}
			});
		}
	});
	
	webSocket.on('close', function () {
		_this.close();
	});
};

Stream.prototype.add = function (message) {
	this.title = message.title;
	this.data = message.data;
	streams[this.name] = this;
};

Stream.prototype.exists = function () {
	return (streams[this.name])? true : false;
};

Stream.prototype.is_name_available = function (name, callback) {
	var copy = new this.app.Copy(name, this.app);
	copy.exists( function (copy_exists) {
		if (!this.get(name) && (!copy_exists || copy.user_id == this.user_id)) {
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
	if (message.name) {
		streams[message.name] = this;
		streams[this.name] = undefined;
		this.name = message.name;
	}
	if (message.title) this.title = message.title;
	if (message.data) this.data = message.data;
};

Stream.prototype.close = function (app) {
	if (!this.exists()) return;
	
	var copy = new this.app.Copy(this.name, this.app);
	copy.save({title: this.title, data: this.data, user_id: this.user_id}, function (result) {
		delete streams[this.name];
	});
};

module.exports = Stream;