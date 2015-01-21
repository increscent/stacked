module.exports = function (app) {
	var Schema = app.mongoose.Schema;
	var copiesSchema = new Schema({
		id: String,
		data: app.mongoose.Schema.Types.Mixed
	});
	
	if (!app.models) app.models = {};
	app.models.copies = app.mongoose.model('copies', copiesSchema);
};