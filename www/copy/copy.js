var save_button = document.getElementById('copy-save');
var name_input = document.getElementById('copy-name');
var data_textarea = document.getElementById('copy-data');
var feedback_span = document.getElementById('feedback');

save_button.addEventListener('click', save);
name_input.addEventListener('keydown', input_handler);

var name_changed_timeout;
function input_handler(e) {
	if (e.keyCode === 13) {
		save();
	} else {
		name_has_changed = true;
		update_feedback('', false);
		clearTimeout(name_changed_timeout);
		name_changed_timeout = setTimeout(function () {
			check_name(name_input.value);
		}, 500);
	}
}

function check_name(name) {
	name = validate_name(name);
	if (!name) return;
	
	ajax_request('POST', '/is_copy_available', {name: name}, function (result) {
		var data = JSON.parse(result);
		if (data.available) {
			update_feedback('&#9989;', true);
		} else {
			update_feedback('\'' + name + '\' is not available right now');
		}
	});
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

function save() {
	var title = name_input.value;
	var data = data_textarea.value;
	var name = validate_name(title);
	if (!name) return;
	
	ajax_request('POST', '/save', {name: name, title: title, data: data}, function (result) {
		result = JSON.parse(result);
		if (result.error && !result.available) {
			update_feedback('\'' + name + '\' is not available right now', false);
		} else if (!result.error) {
			update_feedback('Copy saved! Access it at <a href="/' + name + '">stacked.us/' + name + '</a>', true);
		} else {
			update_feedback('Oops, something went wrong. Please try again later.', false);
		}
	});
}

function ajax_request(type, url, data, callback) {
	var request = new XMLHttpRequest();
	
	request.open(type.toUpperCase(), url, true);
	request.setRequestHeader("Content-type","application/json");
	request.onload = function () {
		return callback(request.response);
	};
	if (type.toLowerCase() === 'post') data = JSON.stringify(data);
	request.send(data);
}

function redirect(url) {
	window.location.href = url;
}