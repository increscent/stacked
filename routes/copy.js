module.exports = function (app) {
	app.get('/', function (req, res) {
		app.templating.renderHTML(app.path + 'www/main.html', {}, function (result) {
			res.send(result);
		});
	});
	
	app.post('/save', function (req, res) {
		
	});
	
	app.post('/is_name_available', function (req, res) {
		
	});
};