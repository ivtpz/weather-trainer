var mongoose = require('mongoose');

//  var trainingSchema = new mongoose.Schema({
// 	name : String,
// 	index: Number,
// 	type: String,
// 	minTemp: {type: Number, default: 0},
// 	maxTemp: {type: Number, default: 110},
// 	weather: {type: Array, default: ['clear', 'partly cloudy', 'cloudy']},
// 	restSameType: {type: Number, default: 0},
// 	restAllType: {type: Number, default: 0},
// 	brick: {type: Number, default: -1},
// 	time: {type: Number, default: 0},
// 	day: Array
// });

var trainingSchema = mongoose.Schema({
	name: String
})

mongoose.model('Training', trainingSchema);
