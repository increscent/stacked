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
				// Delete the file if necessary
				if (data[key].type == 'FILE' && data[key].file_path) {
					try {
						app.fs.unlinkSync(data[key].file_path);
					} catch (error) {
						console.log(error);
					}
				}

				// Remove the copy
				app.models.Copy.remove({uri: data[key].uri}, function (err) {
					if (err) console.log(err);
				});

				// unset the uri
				app.Uri.unset(data[key].uri)
			}
		}
	});
}
