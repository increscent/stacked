var Copy = function(name, app) {
	this.name = name;
	this.app = app;
};

Copy.prototype.exists = function(callback) {
	if (this.app.reserved_words.indexOf(this.name) > -1) return callback(true);
	var _this = this;
	this.app.models.copies.findOne({name: this.name}, function (err, copy) {
		return (copy)? callback(copy) : callback(false);
	});
};

Copy.prototype.save = function (data, callback) {
	data.name = this.name;
	var copy;
	if (data._id) {
		copy = data;
	} else {
		copy = new this.app.models.copies(data);
	}
	
	if (data.data) copy.markModified = 'data';
	copy.save( function (err, new_copy) {
		return (err)? callback(false) : callback(new_copy);
	});
};

Copy.prototype.get = function (callback) {
	var _this = this;
	this.app.models.copies.findOne({name: this.name}, function (err, copy) {
		return callback(copy);
	});
};

module.exports = Copy;