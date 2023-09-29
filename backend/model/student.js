var mongoose = require('mongoose');
var Schema = mongoose.Schema;

studentSchema = new Schema( {
    joined: String,
    fullName: String,
    grade: String,
    sex: String,
    tutor: String,
    birth: String,
    email: String,
    project: String,
    Number: Number,
    Area: String,
    guardian1_Name: String,
    guardian1_Number: Number,
    guardian1_Reletionship: String,
    guardian2_Name: String,
    guardian2_Number: Number,
    guardian2_Reletionship: String,
	date : { type : Date, default: Date.now }

}),
student = mongoose.model('student', studentSchema);

module.exports = student;