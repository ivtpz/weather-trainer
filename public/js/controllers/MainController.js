weatherApp.controller('MainController', ['$scope', 'PlanFactory', 'workouts', '$http', function($scope, PlanFactory, workouts, $http) {

$scope.workout = workouts.workouts;

  $scope.runPlanner = function () {
    PlanFactory.query({}, function(success) {
      // Display plan using angular
      $scope.displayPlan = true;
      // Assign plan to angular variable to display in html
      $scope.plan = success;
    });
  };

  $scope.loadWorkouts = function() {
    workouts.create({
      name: "Iveyyyyyyyyy"
    });
  };

  $scope.showDayOptions = function() {
    $scope.displayDayOptions = true;
    $scope.displayWeahterOptions = false;
  };

  $scope.showWeatherOptions = function() {
    $scope.displayDayOptions = false;
    $scope.displayWeahterOptions = true;
  };

}]);
