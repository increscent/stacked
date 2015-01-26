var streams = {};

var Stream = function (webSocket, app) {
	this.app = app;
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
			var copy = new _this.app.Copy(message.name, _this.app);
			copy.exists( function (copy_exists) {
				if (!_this.exists() && !copy_exists) {
					_this.name = message.name;
					_this.title = message.title;
					_this.data = message.data;
					_this.add();
				}
			});
		} else if (message.type === 'update') {
			if (_this.exists()) {
				_this.update(message.data);
			}
		}
	});
	
	webSocket.on('close', function () {
		_this.close();
	});
};

Stream.prototype.add = function () {
	streams[this.name] = this;
};

Stream.prototype.exists = function () {
	return (streams[this.name])? true : false;
};

Stream.prototype.get = function (name) {
	return streams[name];
};

Stream.prototype.update = function (data) {
	this.data = data;
};

Stream.prototype.close = function (app) {
	if (!this.exists()) return;
	console.log(this.name);
	console.log(this.title);
	console.log(this.data);
	var copy = new this.app.Copy(this.name, this.app);
	copy.save({title: this.title, data: this.data}, function (result) {
		delete streams[this.name];
	});
};

module.exports = Stream;