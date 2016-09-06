var Training = require('../models/training');
var path = require('path');
var sort = require('./sort')

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
app.get('/', sort.index);
app.get('/makePlan', sort.retrieveWeatherPlan);


};
