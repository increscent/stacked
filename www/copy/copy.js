var file_input = document.getElementById('load-file');
var title_input = document.getElementById('copy-title');
var data_textarea = document.getElementById('copy-text');
var feedback_span = document.getElementById('feedback');

var stream = new Stream();
stream.on_error = function (message) {
	update_feedback(message.error_text, false);
};
stream.on_success = function (message) {
	update_feedback(message.success_text, true);
};

file_input.addEventListener('change', only_files);
title_input.addEventListener('input', input_handler);
data_textarea.addEventListener('input', input_handler);

function only_files() {
	remove_element(data_textarea);
}

var input_change_timeout;
function input_handler(e) {
	update_feedback('', false);
	// if the user has not changed title input, update it automatically
	if (!user_input_for_title) {
		if (e.srcElement.id === 'copy-title') {
			user_input_for_title = true;
		} else {
			update_title();
		}
	}
	// save after one second of not typing
	clearTimeout(input_change_timeout);
	input_change_timeout = setTimeout(function () {
		update_stream();
	}, 1000);
}

var user_input_for_title = false;
function update_title() {
	var data = data_textarea.value;
	// find first space after 10 characters
	var first_space = data.indexOf(' ', 10);
	if (first_space < 0) first_space = data.length;
	title_input.value = data.substring(0, first_space);
}

function update_stream() {
	var name = validate_name(title_input.value);
	var title = title_input.value;
	var data = data_textarea.value;
	
	if (name) stream.send_update(name, title, data);
}

function update_feedback(feedback, positive) {
	feedback_span.innerHTML = feedback;
	if (positive)
		feedback_span.className = 'feedback feedback-positive';
	else
		feedback_span.className = 'feedback feedback-negative';
}

function validate_name(name) {
	var original = name;
	var regex = new RegExp(' ', 'g');
	name = name.replace(regex, '');
	name = name.toLowerCase();
	name = decodeURIComponent(encodeURIComponent(name));
	return name;
}

// function ajax_request(type, url, data, callback) {
// 	var request = new XMLHttpRequest();
	
// 	request.open(type.toUpperCase(), url, true);
// 	request.setRequestHeader("Content-type","application/json");
// 	request.onload = function () {
// 		return callback(request.response);
// 	};
// 	if (type.toLowerCase() === 'post') data = JSON.stringify(data);
// 	request.send(data);
// }

function redirect(url) {
	window.location.href = url;
}

function remove_element(node) {
    node.parentNode.removeChild(node);
}