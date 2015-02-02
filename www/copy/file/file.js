function fileController() {
	file_input = document.getElementById('copy-file');
	title_input = document.getElementById('copy-title');
	feedback_span = document.getElementById('feedback');
	
	title_input.focus();
	
	stream = new Stream();
	websocket_connections.push(stream);
	stream.on_error = function (message) {
		update_feedback(message.error_text, false);
	};
	stream.on_success = function (message) {
		update_feedback(message.success_text, true);
	};
	
	file = new File(file_input);
	file.get_file_updates = handle_file_change;
	file_data = '';
	
	title_input.addEventListener('input', title_input_handler);
	user_input_for_title = false;
}

var file_input;
var title_input;
var feedback_span;
var file;
var stream;
var user_input_for_title;
var file_data;

function title_input_handler(e) {
	user_input_for_title = true;
	update_file_stream();
}

function handle_file_change(data) {
	file_data = data;
	if (!user_input_for_title) {
		title_input.value = file_input.files[0].name;
	}
	update_file_stream();
}

function update_file_stream() {
	var name = validate_name(title_input.value);
	var title = title_input.value;
	var data = file_data;
	
	if (name) stream.send_update(name, title, data);
}