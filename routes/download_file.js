module.exports = function (app) {
  app.get('/download/:uri', function (req, res) {
    var uri = req.params.uri;
		// check if copy is in streams
		var stream = new app.Stream(undefined, app);
		stream = stream.get(uri);
		if (stream) {
      serve_file(stream.file_path, stream.file_name, res, app);
			return;
		}
		// then check if it is in the db
		var copy = new app.Copy(uri, app);
		copy.get( function (result, error) {
			if (result) {
        serve_file(result.file_path, result.file_name, res, app);
			} else {
				res.send(error);
			}
		});
  });
};

function serve_file(file_path, file_name, res, app) {
  try {
    var filestream = app.fs.createReadStream(file_path);

    var mimetype = app.npm_mime.lookup(file_path);
    res.setHeader('Content-disposition', 'attachment; filename=' + file_name);
    res.setHeader('Content-type', mimetype);

    filestream.pipe(res);
  } catch (error) {
    res.send();
  }
}
