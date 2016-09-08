weatherApp.controller('MainController', ['$scope', 'PlanFactory', 'workouts', '$http', function($scope, PlanFactory, workouts, $http) {

$scope.workout = workouts.workouts;

// At page landing, set index to 0

//   $http.post('/api/indexer', {}).success(function(data) {
//   console.log(data);
// });



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
      name: $scope.workoutName,
      //index: $scope.index,
      type: $scope.workoutType,
      restAllType: $scope.restAllType,
      restSameType: $scope.restSameType,
      day: [$scope.selectDay]
    });
    $scope.index++
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
