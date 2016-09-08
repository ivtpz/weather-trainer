var mongoose = require('mongoose');
var path = require('path');
var sort = require('./sort')
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
    // index: req.body.index,
    type : req.body.type,
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

// app.put('/api/indexer', function(req, res) {
//   var query = {count: req};
//   Index.update(query, {count: req++}, function(err, index) {
//     if (err)
//       res.send(err);
//     res.send(index.count);
//   });
// });

// app.post('/api/indexer', function(req, res) {
//   Index.create({count: 0}, function(err, entry) {
//     if (err)
//       res.send(err);
//     res.json(entry);
//   });
// });

//   app.get('/api/indexer', function(req, res) {
//     Index.find(function(err, entry) {
//     if (err)
//       res.send(err)
//     if(entry.length === 0) {
//       res.send(true);
//     } else {
//       res.send(false);
//     }
//   });
// });


//application======================================
app.get('/', sort.index);
app.get('/makePlan', sort.retrieveWeatherPlan);


};
