module.exports = function () {
	var express = require('express');
	var app = express();
	
	app.path = __dirname + '/../';
	app.production = false;
	app.port = 1920;
	app.use(express.static(app.path + 'www'));
	
	if (!app.production) require('./dev-config.js')(app);
	
	return app;
};