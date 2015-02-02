var File = function (file_input) {
	this.update_interval;
	this.get_file_updates;
	this.timestamp;
	this.reader = new FileReader();
	
	var _this = this;
	file_input.addEventListener('change', function (e) {
		_this.timestamp = 0;
		var file = file_input.files[0];
		_this.check_file_changes(file, _this.get_file_updates);
	});
};

File.prototype.check_file_changes = function (file, update_callback) {
	var _this = this;
	this.read_file(file, update_callback);
	
	if (this.update_interval) clearInterval(this.update_interval);
	this.update_interval = setInterval( function () {
		_this.read_file(file, update_callback);
	}, 1000);
};

File.prototype.read_file = function (file, callback) {
	if (!file) {
		if (this.update_interval) clearInterval(this.update_interval);
		return;
	}
	if (file.lastModified === this.timestamp) return;
	this.timestamp = file.lastModified;

	var _this = this;
	this.reader.onload = function(e) {
		return callback(_this.reader.result);
	};

	this.reader.readAsText(file);
};