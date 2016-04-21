ngApp.controller('DriverMenuController', function($scope, $rootScope, $location, $controller, $location, Api, Auth, SessionUser, $routeParams){
	$scope.changeLocation = function(segment){
		$location.path('/drivers/'+$routeParams.id+'/'+segment);
	};

	$scope.getClass = function (path) {
      if ($location.path().indexOf(path) > -1) {
        return 'active';
      } else {
        return '';
      }
    }

	Api.send(URLS.driverDetails, {driver_id: $routeParams.id }, function (data, status) {
            $scope.driver = data.data.driver;  
    });
});