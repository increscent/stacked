var Copy = function(name, app) {
	this.name = name;
	this.app = app;
};

Copy.prototype.exists = function(callback) {
	if (this.app.reserved_words.indexOf(this.name) > -1) return callback(true);
	var _this = this;
	this.app.models.copies.findOne({name: this.name}, function (err, copy) {
		_this.copy = copy;
		return (copy)? callback(copy) : callback(false);
	});
};

Copy.prototype.save = function (data, callback) {
	if (this.copy) {
		for (var key in data) {
			this.copy[key] = data[key];
		}
	} else {
		var copy_data = {};
		for (var key in data) {
			copy_data[key] = data[key];
		}
		copy_data.name = this.name;
		this.copy = new this.app.models.copies(copy_data);
	}
	
	if (data.data) this.copy.markModified = 'data';
	this.copy.save( function (err, new_copy) {
		return (err)? callback(false) : callback(new_copy);
	});
};

Copy.prototype.get = function (callback) {
	var _this = this;
	this.app.models.copies.findOne({name: this.name}, function (err, copy) {
		_this.copy = copy;
		return callback(copy);
	});
};

module.exports = Copy;