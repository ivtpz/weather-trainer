weatherApp.controller('MainController', ['$scope', 'PlanFactory', 'workouts', '$http', function($scope, PlanFactory, workouts, $http) {

//Get current list of added workouts stored in w.workouts

$scope.workouts = [];

// If database is empty, set index to 0, otherwise
// set scope index to count in route /api/indexer
// /api/indexer always has 1 entry, increments when workout is added
$http.get('/api/indexer').success(function(data) {
  if(data.length === 0) {
    $http.post('/api/indexer').success(function(data) {
    $scope.index = 0;
    });
  } else {
    $scope.index = data[0].count;
  }
});


//Run weather planner after all workouts are loaded (final submit)
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
      index: $scope.index,
      type: $scope.workoutType,
      restAllType: $scope.restAllType,
      restSameType: $scope.restSameType,
      day: [$scope.selectDay]
    }).then(function(workouts) {
      $scope.workouts = workouts;
      $scope.$apply();
      console.log($scope.workouts);
    });

    workouts.addOne($scope.index).then(function(newIndex) {
      $scope.index = newIndex;
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
