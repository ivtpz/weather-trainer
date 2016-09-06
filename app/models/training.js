var mongoose = require('mongoose');

module.exports = mongoose.model('Training', {
	name : String,
	index: Number,
	type: String,
	minTemp: {type: Number, default: 0},
	maxTemp: {type: Number, default: 110},
	weather: Array,
	restSameType: {type: Number, default: 0},
	restAllType: {type: Number, default: 0},
	brick: {type: Number, default: -1},
	time: {type: Number, default: 0},
	day: Array
});
