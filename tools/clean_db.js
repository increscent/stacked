module.exports = function (app) {
	remove_overdue_copies(app);
	setInterval(function () {
		remove_overdue_copies(app);
	}, app.clean_interval);
};

function remove_overdue_copies(app) {
	app.models.copies.find({}, function (err, data) {
		for (var key in data) {
			if ((new Date()).getTime() - data[key].timestamp.getTime() > app.copy_duration) {
				app.models.copies.remove({name: data[key].name}, function (err) {
					if (err) console.log(err);
				});
			}
		}
	});
}