var fs = require('fs');

var cached_files = {};

var init = function (app) {
	fs.readFile(app.headerHTML, 'utf8', function (err, data) {
		cached_files.header = data;
	});
	fs.readFile(app.footerHTML, 'utf8', function (err, data) {
		cached_files.footer = data;
	});
};

var replaceData = function (file_contents, replace_object) {
	var keys = Object.keys(replace_object);
	replace_object.header = cached_files.header;
	replace_object.footer = cached_files.footer;
	keys.unshift('header');
	keys.unshift('footer');
	
	var delimiter = '`';
	if (replace_object.delimiter) delimiter = replace_object.delimiter;
	
	for (var key in keys) {
		key = keys[key];
		if (!replace_object[key]) replace_object[key] = '';
		var regex = new RegExp(delimiter + ' *' + key + ' *' + delimiter, 'g');
		file_contents = file_contents.replace(regex, replace_object[key]);
	}
	
	return file_contents;
};
	
module.exports.renderHTML = function (filename, replace_object, callback) {
		if (cached_files[filename]) {
			return callback(replaceData(cached_files[filename], replace_object));
		} else {
			fs.readFile(filename, 'utf8', function (err, data) {
				if (err) throw err;
				return callback(replaceData(data, replace_object));
			});
		}
};

module.exports.init = init;