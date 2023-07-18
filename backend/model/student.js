var mongoose = require('mongoose');
var Schema = mongoose.Schema;

studentSchema = new Schema( {
	name: String,
    grade: String,
    averageMark: Number,
	date : { type : Date, default: Date.now }
}),
student = mongoose.model('student', studentSchema);

module.exports = student;