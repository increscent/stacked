var File = function (file_input, file_selector) {
	this.update_interval;
	this.timestamp;
	this.file_selector = file_selector;
	this.reader = new FileReader();
	
	var _this = this;
	file_input.addEventListener('change', function (e) {
		_this.timestamp = 0;
		var file = file_input.files[0];
		_this.check_file_changes(file);
	});
};

File.prototype.check_file_changes = function (file) {
	var _this = this;
	this.read_file(file);
	
	if (this.update_interval) clearInterval(this.update_interval);
	this.update_interval = setInterval( function () {
		_this.read_file(file);
	}, 1000);
};

File.prototype.read_file = function (file) {
	if (!file) {
		if (this.update_interval) clearInterval(this.update_interval);
		return;
	}
	if (file.lastModified === this.timestamp) return;
	this.timestamp = file.lastModified;

	var _this = this;
	this.reader.onload = function(e) {
		_this.file_selector.handleFileChange(_this.reader.result);
	};

	this.reader.readAsText(file);
};