app.controller('MainController', ['$scope', 'PlanFactory', function($scope, PlanFactory) {
  PlanFactory.query({}, function(success) {
    $scope.plan = success;
  });

}]);
