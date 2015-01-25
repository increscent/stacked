// a few configurations
var app = require('./config/config.js')();
app.production = true;

app.templating = require('./tools/templating.js');
app.templating.init(app);

// load in models
require('./models/copies.js')(app);

// init routes
require('./routes/copy.js')(app);
require('./routes/paste.js')(app);

// clean up overdue copies from db
require('./tools/clean_db.js')(app);

// start the server
var http = require('http');
http.createServer(app).listen(app.port, function() {
  console.log('Server listening on port ' + app.port);
});