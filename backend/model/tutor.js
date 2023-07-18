var mongoose = require('mongoose');
var Schema = mongoose.Schema;

productSchema = new Schema( {
    name: String,
    payRate: Number,
    weeklyHours : Number,
    monthlyHours: Number,
    yearlyHours: Number,
    weeklyEarnings : Number,
    monthlyEarnings: Number,
    yearlyEarnings: Number,

	date : { type : Date, default: Date.now }
}),
tutor = mongoose.model('tutor', productSchema);

module.exports = tutor;