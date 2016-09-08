var mongoose = require('mongoose');
var path = require('path');
var sort = require('./sort')
var Training = mongoose.model('Training');

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
  console.log("!!!!!!!!!1" +req.body.name);
  Training.create({
    name : req.body.name
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
app.get('/', sort.index);
app.get('/makePlan', sort.retrieveWeatherPlan);


};
