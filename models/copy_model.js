// A copy is a MongoDB document that stores information posted

module.exports = function (app) {
	var Schema = app.mongoose.Schema;
	var copySchema = new Schema({
		uri: Number,
		title: String,
		timestamp: {type: Date, default: Date.now},
		data: String,
		file_path: String,
		file_name: String,
		type: String,
		user_id: String // cookie id
	});

	if (!app.models) app.models = {};
	app.models.Copy = app.mongoose.model('Copy', copySchema);
};
