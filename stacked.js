// a few configurations
var app = require('./config/config.js')();

app.templating = require('./templating/templating.js');

// init routes
require('./routes/routes.js')(app);

// start the server
var http = require('http');
http.createServer(app).listen(app.port, function() {
  console.log('Server listening on port ' + app.port);
});