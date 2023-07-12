var mongoose = require('mongoose');
var Schema = mongoose.Schema;

productSchema = new Schema( {
    name: String,
    payRate: Number,
	date : { type : Date, default: Date.now }
}),
tutor = mongoose.model('tutor', productSchema);

module.exports = tutor;