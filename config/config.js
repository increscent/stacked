module.exports = function () {
	var express = require('express');
	var app = express();
	
	app.mongoose = require('mongoose');
	app.mongoose.connect('mongodb://127.0.0.1:27017/stacked');
	
	app.path = __dirname + '/../';
	app.port = 1920;
	
	app.bodyParser = require('body-parser');
	app.use(app.bodyParser.urlencoded());
	app.use(app.bodyParser.json());
	app.use(express.static(app.path + 'www'));
	
	if (!app.production) require('./dev-config.js')(app);
	
	return app;
};