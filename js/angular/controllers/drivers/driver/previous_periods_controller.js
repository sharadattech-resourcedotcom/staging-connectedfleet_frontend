ngApp.controller('DriverPreviousPeriodsController', function($scope, $rootScope, $location, $controller, $location, Api, Auth, SessionUser, $routeParams){
    
	$scope.getClosedPeriods = function() {
        Api.send(URLS.closedPeriods, {driver_id: $routeParams.id}, function (data, status) {
            $scope.previousPeriods = data.data.periods;
        });
    };

    $scope.showPeriodDetails = function(period){
    	$location.path($location.url()+'/'+period.id);
    };

    $scope.getClosedPeriods();
});