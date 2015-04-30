var routes = {
  text: {
    controller: textController,
    template: '/copy/text/text.html'
  },
  file: {
    controller: fileController,
    template: '/copy/file/file.html'
  }
};

var STARTING_ROUTE = 'text';
var templates = {};
var view_container = document.getElementById('view');
var websocket_connections = [];

// load all templates
for (var route in routes) {
  load_template(route, function (template) {});
}

function load_template(route, callback) {
  var template = routes[route].template;
  if (templates[template]) return callback(templates[template]);
  ajax_request('GET', template, undefined, function (data) {
    templates[template] = data;
    // start with the first route
    if (route === STARTING_ROUTE) open_route(STARTING_ROUTE);
    return callback(templates[template]);
  });
}

function close_websockets() {
  for (var key in websocket_connections) {
    websocket_connections[key].close();
    delete websocket_connections[key];
  }
}

function open_route(route) {
  close_websockets();
  load_template(route, function (template_html) {
    view_container.innerHTML = template_html;
    routes[route].controller();
  });
}


/** global functions **/

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

function update_feedback(feedback_span, feedback, positive) {
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
