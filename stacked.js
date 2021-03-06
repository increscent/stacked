// a few configurations
var app = require('./config/config.js')();
app.production = true;

// html templating
app.templating = require('./tools/templating.js');
app.templating.init(app);

// load in models
require('./models/copy_model.js')(app);

// load in classes
app.Copy = require('./routes/classes/copy_class.js');
app.Stream = require('./routes/classes/stream_class.js');
app.Uri = require('./routes/classes/uri_class.js')(app);

// init routes
require('./routes/copy.js')(app);
require('./routes/paste.js')(app);
require('./routes/stream.js')(app);
require('./routes/upload_file.js')(app);
require('./routes/download_file.js')(app);

// clean up overdue copies from db
require('./tools/clean_db.js')(app);

// start the server
var http = require('http');
http.createServer(app).listen(app.port, function() {
  console.log('Server listening on port ' + app.port);
});
