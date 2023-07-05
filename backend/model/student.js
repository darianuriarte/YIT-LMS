var mongoose = require('mongoose');
var Schema = mongoose.Schema;

productSchema = new Schema( {
	name: String,
	tutor: String,
    grade: String,
    averageMark: Number,
	date : { type : Date, default: Date.now }
}),
student = mongoose.model('student', productSchema);

module.exports = product;