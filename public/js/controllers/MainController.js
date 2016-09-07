app.controller('MainController', ['$scope', 'PlanFactory', function($scope, PlanFactory) {
  $scope.runPlanner = function ($scope) {
    PlanFactory.query({}, function(success) {
      // Display plan using angular
      $scope.displayPlan = true;
      // Assign plan to angular variable to display in html
      $scope.plan = success;
    });
  };

}]);
