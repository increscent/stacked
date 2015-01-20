var fs = require('fs');

var cached_files = {};

var replaceData = function (file_contents, replace_object) {
	var delimiter = '`';
	if (replace_object.delimiter) delimiter = replace_object.delimiter;
	
	for (var key in replace_object) {
		var regex = new RegExp(delimiter + ' *' + key + ' *' + delimiter, 'g');
		file_contents = file_contents.replace(regex, replace_object[key]);
	}
	
	return file_contents;
};
	
module.exports.renderHTML = function (filename, replace_object, callback) {
		if (cached_files[filename]) {
			return callback(replaceData(cached_files[filename], replace_object));
		}
		
		fs.readFile(filename, 'utf8', function (err, data) {
			if (err) throw err;
			return callback(replaceData(data, replace_object));
		});
};