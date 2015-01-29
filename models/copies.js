module.exports = function (app) {
	var Schema = app.mongoose.Schema;
	var copiesSchema = new Schema({
		name: String,
		title: String,
		timestamp: {type: Date, default: Date.now},
		data: app.mongoose.Schema.Types.Mixed,
		user_id: String // cookie id
	});
	
	if (!app.models) app.models = {};
	app.models.copies = app.mongoose.model('copies', copiesSchema);
};