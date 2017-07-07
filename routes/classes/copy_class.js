var Copy = function(uri, app) {
	this.uri = uri;
	this.app = app;
};

Copy.prototype.exists = function(callback) {
	if (this.app.reserved_words.indexOf(this.uri) > -1) return callback(true);
	var _this = this;
	this.app.models.Copy.findOne({uri: this.uri}, function (err, copy) {
		return (copy)? callback(copy) : callback(false);
	});
};

Copy.prototype.save = function (data, callback) {
	data.uri = this.uri;
	var copy;
	if (data._id) {
		copy = data;
	} else {
		copy = new this.app.models.Copy(data);
	}

	copy.save( function (err, new_copy) {
		return (err)? callback(false) : callback(new_copy);
	});
};

Copy.prototype.get = function (callback) {
	var _this = this;
	this.app.models.Copy.findOne({uri: this.uri}, function (err, copy) {
		return callback(copy, err);
	});
};

module.exports = Copy;
