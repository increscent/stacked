function textController() {
  title_input = document.getElementById('copy-title');
  data_textarea = document.getElementById('copy-text');
  feedback_span = document.getElementById('feedback');

  data_textarea.focus();

  stream = new Stream();
  websocket_connections.push(stream);
  stream.on_error = function (message) {
    update_feedback(feedback_span, message.error_text, false);
  };
  stream.on_uri = function (uri) {
    var uri_text = 'saved at <a target="_blank" href="/' + uri + '">http://stacked.increscent.org/' + uri + '</a>';
    update_feedback(feedback_span, uri_text, true);
  };

  title_input.addEventListener('input', input_handler);
  data_textarea.addEventListener('input', input_handler);
  data_textarea.addEventListener('input', resize_textarea);

  user_input_for_title = false;
}

var title_input;
var data_textarea;
var feedback_span;
var stream;
var input_change_timeout;
var user_input_for_title;

function input_handler(e) {
  update_feedback('', false);
  // if the user has not changed title input, update it automatically
  if (!user_input_for_title) {
    var target = (e.target)? e.target : e.srcElement;
    if (target.id === 'copy-title') {
      user_input_for_title = true;
    } else {
      update_title();
    }
  }
  // save after one second of not typing
  clearTimeout(input_change_timeout);
  input_change_timeout = setTimeout(function () {
      update_text_stream();
  }, 1000);
}

function update_title() {
  var data = data_textarea.value;
  // find first space after 10 characters
  var first_space = data.indexOf(' ', 10);
  if (first_space < 0) first_space = data.length;
  first_space = (first_space > 15)? 15 : first_space;
  title_input.value = data.substring(0, first_space);
}

function update_text_stream() {
  var title = title_input.value;
  var data = data_textarea.value;

  stream.send_update(title, data);
}

var resize_textarea = function (e) {
  var target = (e.target) ? e.target : e.srcElement;
  var text = target.value;
  var lines = (text.match(/\n/g) || []).length;
  lines++;
  if (lines > 20) e.srcElement.rows = lines;
};
