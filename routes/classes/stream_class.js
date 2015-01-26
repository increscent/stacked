var streams = {};

var Stream = function (name, app) {
	this.name = name;
	this.app = app;
};

Stream.prototype.exists = function () {
	return (streams[name])? true : false;
};

Stream.prototype.get = function () {
	return streams[name];
};

module.exports = Stream;