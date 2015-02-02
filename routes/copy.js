module.exports = function (app) {
	app.get('/', function (req, res) {
		app.templating.renderHTML('www/copy/copy.html', {css: '/copy/copy.css', html_title: 'new copy'}, function (result) {
			res.send(result);
		});
	});
};

function send_response(res, response, error) {
	response.error = error;
	res.send(JSON.stringify(response));
}