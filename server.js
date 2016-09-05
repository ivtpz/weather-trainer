var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var assert = require('assert');
var path = require('path');
var port = process.env.PORT || 8080;

// configuration ====================================
mongoose.connect('mongodb://localhost/myproject', function(err) {
	if (err) throw err;
});

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

app.use(methodOverride());

// define model ===================================
var Training = mongoose.model('Training', {
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

// routes =========================================

	//api
	//get all training data
	app.get('/api/workouts', function(req, res) {
		Training.find(function(err, workouts) {
			if (err)
				res.send(err)
			res.json(workouts);
		});
	});

	app.post('/api/workouts', function(req, res) {
		Training.create({
			text : req.body.text
		}, function(err, workout) {
			if (err)
				res.send(err);
//find workout after sending to DB
		Training.find(function(err, workouts) {
			if (err)
				res.send(err)
			res.json(workouts);
		});
	});
});

	app.delete('/api/workouts/:workout_id', function(req, res) {
		Training.remove({
			_id : req.params.workout_id
		}, function(err, workout) {
			if (err)
				res.send(err);

		Training.find(function(err, workouts) {
			if (err)
				res.send(err)
			res.json(workouts);
		});
	});
});

//application======================================
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/sort_test.html'));
});

//start app with node =============================
app.listen(port);
console.log('Magic happening at port ' + port);
