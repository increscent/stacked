// a few configurations
var app = require('./config/config.js')();
app.production = false;

app.templating = require('./templating/templating.js');

// load in models
require('./models/copies.js')(app);

// init routes
require('./routes/copy.js')(app);
require('./routes/paste.js')(app);

// start the server
var http = require('http');
http.createServer(app).listen(app.port, function() {
  console.log('Server listening on port ' + app.port);
});