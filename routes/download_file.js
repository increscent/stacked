module.exports = function (app) {
  app.get('/download/:uri', function (req, res) {
    var uri = req.params.uri;
		// check if copy is in streams
		var stream = new app.Stream(undefined, app);
		stream = stream.get(uri);
		if (stream) {
      serve_file(stream.file_path, res, app);
			return;
		}
		// then check if it is in the db
		var copy = new app.Copy(uri, app);
		copy.get( function (result, error) {
			if (result) {
        serve_file(result.file_path, res, app);
			} else {
				res.send(error);
			}
		});
  });
};

function serve_file(file_path, res, app) {
  var filename = app.npm_path.basename(file_path);
  var mimetype = app.npm_mime.lookup(file_path);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  var filestream = app.fs.createReadStream(file_path);
  filestream.pipe(res);
}
