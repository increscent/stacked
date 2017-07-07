function fileController() {
	file_selectors = [];
	parent_element = document.getElementById('file-container');
	add_selector(file_selectors, parent_element);
}
var file_selectors;
var parent_element;

function add_selector() {
	var file_selector = new FileSelection(file_selectors.length, parent_element);
	file_selectors[file_selectors.length] = file_selector;

	file_selector.file_input.addEventListener('change', file_input_handler);
}

function file_input_handler(e) {
	e.srcElement.removeEventListener('change', file_input_handler);
	add_selector();
}

/* =============================
	     FileSelection class
	 ============================= */

var FileSelection = function (id, parent_element) {
	this.initHTML(parent_element);
	this.initStream();
	this.initFile();
	this.initTitle();

	this.uri = '';
	this.title = '';
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
	this.stream.on_uri = function (uri) {
		_this.uri = uri;
    var uri_link = 'saved at <a target="_blank" href="/' + uri + '">http://stacked.increscent.org/' + uri + '</a>';
    update_feedback(_this.feedback_span, uri_link, true);
  };
};

FileSelection.prototype.initFile = function () {
	this.file = new File(this.file_input, this);
};

FileSelection.prototype.handleFileChange = function (formData) {
	this.formData = formData;

	// set the stream name to the file name, if the user hasn't set it already
	if (!this.user_input_for_title) {
		this.title_input.value = this.file_input.files[0].name;
	}

	this.uploadFile(formData);
};

FileSelection.prototype.uploadFile = function (formData) {
	formData.append('uri', this.uri);

	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/upload', true);

	var _this = this;
	xhr.onload = function () {
	  if (xhr.status === 200) {
			_this.updateStream();
		} else {
	    console.log('File Upload Error!');
	  }
	};
	xhr.send(formData);
};

FileSelection.prototype.updateStream = function () {
	var title = this.title_input.value;

	if (title) this.stream.send_update(title, '');
};

FileSelection.prototype.initTitle = function () {
	var _this = this;
	this.title_input.addEventListener('input', function (e) {
		_this.user_input_for_title = true;
		_this.updateStream();
	});
};
