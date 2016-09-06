var app = angular.module('WeatherTrainingPlanner', ['ngResource']);

app.factory('PlanFactory', ['$resource', function($resource) {
  return $resource('/makePlan');
}]);
