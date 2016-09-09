var mongoose = require('mongoose');
var path = require('path');
var sort = require('./sort');
var Training = mongoose.model('Training');
var Index = mongoose.model('Index');

module.exports = function(app) {

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
    name : req.body.name,
    index: req.body.index,
    type : req.body.type,
    minTemp: req.body.minTemp,
    maxTemp: req.body.maxTemp,
    weather: req.body.weather,
    restAllType: req.body.restAllType,
    restSameType: req.body.restSameType,
    day: req.body.day

  }, function(err, workout) {
    if (err)
      res.send(err);

//find workout after sending to DB
  Training.find(function(err, workouts) {
    if (err)
      res.send(err);
    res.json(workouts);
  });
});
});


app.delete('/api/workouts/', function(req, res) {
  Training.remove({
    _id : req.params.workout_id
  }, function(err, workout) {
    if (err)
      res.send(err);
  });
});

app.post('/api/indexer', function(req, res) {
  Index.create({
    count : 0
  }, function(err, workout) {
    if (err)
      res.send(err);

//find workout after sending to DB
  Index.find(function(err, currIndex) {
    if (err)
      res.send(err);
    res.json(currIndex);
  });
});
});

app.put('/api/indexer', function(req, res) {
  console.log(req.body);
  var newIndex = req.body.count + 1;
  console.log(newIndex);
  Index.findOneAndUpdate(req.body, {count: newIndex}, {'new': true}, function(err, index) {
    if (err)
      res.send(err);
    res.json(index);
  });
});

app.get('/api/indexer', function(req, res) {
  Index.find(function(err, currIndex) {
    if (err)
      res.send(err)
    res.json(currIndex);
  });
});


//application======================================
app.get('/', sort.index);
app.get('/makePlan', function(req, res) {
  Training.find(function(err, workouts) {
    if (err)
      res.send(err);
    sort.retrieveWeatherPlan(workouts)
    .then(function(plan){
      res.send(plan);
    });
  });
});


};


