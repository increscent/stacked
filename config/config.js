module.exports = function () {
	var express = require('express');
	var app = express();

	// Connect to MongoDB
	app.mongoose = require('mongoose');
	app.mongoose.connect('mongodb://127.0.0.1:27017/stacked', {useMongoClient: true});
	var db = app.mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	var WebSocketServer = require('ws').Server;
  app.webSocket = new WebSocketServer({port: 1921});

	app.path = __dirname + '/../';
	app.port = 1920;

	// how long a given copy is guaranteed to last
	app.copy_duration = 86400000; // 24 hours
	// how often we clean the db
	app.clean_interval = 3600000; // 1 hour

	app.headerHTML = 'www/header.html';
	app.footerHTML = 'www/footer.html';

	app.reserved_words = ['source', 'about', 'stacked', 'raw', 'footer.html', 'header.html', 'main.css'];

	app.bodyParser = require('body-parser');
	app.use(app.bodyParser.urlencoded({extended: true}));
	app.use(app.bodyParser.json());

	app.cookieParser = require('cookie-parser');
	app.use(app.cookieParser());
	require(app.path + 'tools/cookie.js')(app);

	app.formidable = require('express-formidable');
	app.use('/upload', app.formidable({uploadDir: __dirname + '/../uploads/'}));

	app.npm_path = require('path');
	app.npm_mime = require('mime');
	app.fs = require('fs');

	app.uuid = require('uuid');

	app.shortid = require('shortid');

	var Entities = require('html-entities').AllHtmlEntities;
	app.htmlencode = (new Entities()).encode;

	app.use(express.static(app.path + 'www'));

	if (!app.production) require('./dev-config.js')(app);

	return app;
};
