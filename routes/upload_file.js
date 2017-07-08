module.exports = function (app) {
  app.post('/upload', function (req, res) {
    var uri = req.fields.uri;
    var file_path = req.files.data.path;
    var file_name = req.files.data.name;
		// check if copy is in streams
		var stream = new app.Stream(undefined, app);
		stream = stream.get(uri);
		if (stream) {
      stream.file_update(file_path, file_name)
      res.send();
			return;
		}
		// then check if it is in the db
		var copy = new app.Copy(uri, app);
		copy.get( function (result, error) {
			if (result) {
        result.file_path = file_path;
        result.file_name = file_name;
        result.type = 'FILE';
        copy.save(result, function (err, new_copy) {
          res.send();
        });
			} else {
				res.send(error);
			}
		});
  });
};
