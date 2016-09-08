var weatherApp = angular.module('WeatherTrainingPlanner', ['ngResource', 'ui.router']);


weatherApp.factory('PlanFactory', ['$resource', function($resource) {
  return $resource('/makePlan');
}]);

weatherApp.factory('workouts', ['$http', function($http){
  var w = {
    workouts: []
  };

  w.getAll = function() {
    return $http.get('/api/workouts').success(function(data){
      angular.copy(data, w.workouts);
    });
  };

  w.create = function(workout) {
    console.log(workout);
     $http.post('/api/workouts', workout).success(function(data){
      w.workouts.push(data);
      console.log(data);
    });
  };

  return w;
}]);






