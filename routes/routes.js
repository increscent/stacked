module.exports = function (app) {
	app.get('/', function (req, res) {
		app.templating.renderHTML(app.path + 'www/main.html', {test: 'hello world!'}, function (result) {
			res.send(result);
		});
	});
	
	app.get('/*', function (req, res) {
		
	});
};