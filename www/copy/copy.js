var file_button = document.getElementById('load-file');
var title_input = document.getElementById('copy-title');
var data_textarea = document.getElementById('copy-text');
var feedback_span = document.getElementById('feedback');

var stream = new Stream();
stream.on_error = function (message) {
	update_feedback(message.error_text, false);
};

file_button.addEventListener('click', false);
title_input.addEventListener('keydown', input_handler);
data_textarea.addEventListener('keydown', input_handler);

var input_change_timeout;
function input_handler(e) {
	update_feedback('', false);
	clearTimeout(input_change_timeout);
	input_change_timeout = setTimeout(function () {
		update_stream();
	}, 1000);
}

function update_stream() {
	var name = validate_name(title_input.value);
	var title = title_input.value;
	var data = data_textarea.value;
	
	stream.send_update(name, title, data);
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