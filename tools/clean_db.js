module.exports = function (app) {
	remove_overdue_copies(app);
	setInterval(function () {
		remove_overdue_copies(app);
	}, app.clean_interval);
};

function remove_overdue_copies(app) {
	app.models.Copy.find({}, function (err, data) {
		for (var key in data) {
			if ((new Date()).getTime() - data[key].timestamp.getTime() > app.copy_duration) {
				app.models.Copy.remove({uri: data[key].uri}, function (err) {
					if (err) console.log(err);
				});
			}
		}
	});
}
