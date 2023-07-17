var mongoose = require('mongoose');
var Schema = mongoose.Schema;

sessionSchema = new Schema( {
	name: String,
	comments: String,
	taskAssignment: String,
	date: Date,
	attendance: String,
	hours: Number,
	tutor: String,
	user_id: Schema.ObjectId,
	is_delete: { type: Boolean, default: false },
	date : { type : Date, default: Date.now }
}),
sessions = mongoose.model('sessions', sessionSchema);

module.exports = sessions;