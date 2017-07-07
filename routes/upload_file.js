module.exports = function (app) {
  app.post('/upload', function (req, res) {
    var uri = req.fields.uri;
    var path = req.files.data.path;
		// check if copy is in streams
		var stream = new app.Stream(undefined, app);
		stream = stream.get(uri);
		if (stream) {
      stream.file_update(path)
      res.send();
			return;
		}
		// then check if it is in the db
		var copy = new app.Copy(uri, app);
		copy.get( function (result, error) {
			if (result) {
        result.file_path = path;
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
