var weatherApp = angular.module('WeatherTrainingPlanner', ['ngResource', 'ui.router']);


weatherApp.factory('PlanFactory', ['$http', function($http) {
  var p = {};
  p.sendWorkouts= function() {
    return new Promise(function(resolve) {
      $http.get('/makePlan').success(function(data) {
      resolve(data);
      });
    });
  };
  return p;
}]);

weatherApp.factory('workouts', ['$http', function($http){
var w ={};

  w.getAll = function() {
    return $http.get('/api/workouts').success(function(data){
      angular.copy(data, w.workouts);
    });
  };

  w.create = function(workout) {
    console.log(workout);
    return new Promise(function(resolve) {
     $http.post('/api/workouts', workout).success(function(data){
      resolve(data);
    });
   });
  };
     // increment index
   w.addOne = function(currentIndex){
    return new Promise(function(resolve) {
      $http.put('/api/indexer', {count: currentIndex}).success(function(data) {
      resolve(data.count);
    });
   });
  };
return w;

}]);






