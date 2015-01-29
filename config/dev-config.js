module.exports = function (app) {
	var response_time = require('response-time');
	app.use(response_time());
};