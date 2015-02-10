function fileController() {
	var file_selectors = [];
	var parent_element = document.getElementById('file-container');
	
	file_selectors[file_selectors.length] = new FileSelection(file_selectors.length, parent_element);
}

/* =============================
	     FileSelection class
	 ============================= */

var FileSelection = function (id, parent_element) {
	this.initHTML(parent_element);
	this.initStream();
	this.initFile();
	this.initTitle();
	
	this.title = '';
	this.data = '';
	this.user_input_for_title = false;
};

FileSelection.prototype.initHTML = function (parent_element) {
	this.file_input = document.createElement('input');
	this.file_input.type = 'file';
	
	this.title_input = document.createElement('input');
	this.title_input.type = 'text';
	this.title_input.className = 'copy-name-input focus-border-outline';
	this.title_input.placeholder = 'Name';
	
	this.feedback_span = document.createElement('span');
	this.feedback_span.className = 'feedback';
	
	var div = document.createElement('div');
	div.appendChild(this.file_input);
	div.appendChild(this.title_input);
	div.appendChild(this.feedback_span);
	
	parent_element.appendChild(div);
	
	this.title_input.focus();
};

FileSelection.prototype.initStream = function () {
	this.stream = new Stream();
	// update the global variable 'websocket_connections'
	websocket_connections.push(this.stream);
	
	var _this = this;
	this.stream.on_error = function (message) {
		// 'update_feedback' is a global function
		update_feedback(_this.feedback_span, message.error_text, false);
	};
	this.stream.on_success = function (message) {
		// 'update_feedback' is a global function
		update_feedback(_this.feedback_span, message.success_text, true);
	};
};

FileSelection.prototype.initFile = function () {
	this.file = new File(this.file_input, this);
};

FileSelection.prototype.handleFileChange = function (data) {
	this.data = data;
	// set the stream name to the file name, if the user hasn't set it already
	if (!this.user_input_for_title) {
		this.title_input.value = this.file_input.files[0].name;
	}
	this.updateFileStream();
};

FileSelection.prototype.updateFileStream = function () {
	var name = validate_name(this.title_input.value);
	var title = this.title_input.value;
	var data = this.data;
	
	if (name) this.stream.send_update(name, title, data);
};

FileSelection.prototype.initTitle = function () {
	var _this = this;
	this.title_input.addEventListener('input', function (e) {
		_this.user_input_for_title = true;
		_this.updateFileStream();
	});
};