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
    PlanFactory.sendWorkouts().then(function(success) {
      // Display plan using angular
      $scope.displayPlan = true;
      // Assign plan to angular variable to display in html
      $scope.plan = success;
      $scope.$apply();
    });
  };
//resetting form not working
  $scope.loadWorkouts = function(form) {
    console.log(form);
    workouts.create({
      name: $scope.workoutName,
      index: $scope.index,
      type: $scope.workoutType,
      restAllType: $scope.restAllType,
      restSameType: $scope.restSameType,
      day: [$scope.selectDay]
    }).then(function(workouts) {
      $scope.workouts = workouts;
      $scope.added = true;
      $scope.$apply();
    });


    workouts.addOne($scope.index).then(function(newIndex) {
      $scope.index = newIndex;
    });
    form.$setPristine();
  };

  $scope.loadWorkoutsWeather = function() {
    var condArray = [];
    if($scope.clear) condArray.push("clear");
    if($scope.partlyCloudy) condArray.push("partly cloudy");
    if($scope.cloudy) condArray.push("cloudy");
    if($scope.windy) condArray.push("windy");
    if($scope.rain) condArray.push("rain");
    workouts.create({
      name: $scope.workoutName,
      index: $scope.index,
      type: $scope.workoutType,
      restAllType: $scope.restAllType,
      restSameType: $scope.restSameType,
      minTemp: $scope.minTemp,
      maxTemp: $scope.maxTemp,
      weather: condArray
    }).then(function(data) {
      workouts.addOne($scope.index).then(function(newIndex) {
        $scope.index = newIndex;
      });

      $scope.workouts = data;
      $scope.added = true;
      $scope.$apply();
    });


  };
//Probably should be directives
  $scope.showDayOptions = function() {
    $scope.displayDayOptions = true;
    $scope.displayWeatherOptions = false;
  };

  $scope.showWeatherOptions = function() {
    $scope.displayDayOptions = false;
    $scope.displayWeatherOptions = true;
  };
// Toggle Submit button for planning with weather
$scope.$watch('[clear,partlyCloudy,cloudy,windy,rain]', function() {
  $scope.disableBtn = !$scope.clear && !$scope.partlyCloudy && !$scope.cloudy && !$scope.windy && !$scope.rainy;}, true);
}]);

