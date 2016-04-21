ngApp.controller('DriverTripsController', function($scope, $rootScope, $location, $controller, $location, Api, Auth, SessionUser, $routeParams){

	$scope.success = '';
	$scope.errors = '';
	$scope.filter = '';

	 $scope.getTrips = function() {
        Api.send(URLS.listTrips, {user_id: $routeParams.id}, function (data, status) {
            $scope.trips = data.data.trips;
        });
    };

    $scope.redirectToTripDetails = function(id) {
	    $location.path('/trips/' + id.toString());
	};

	$scope.getTrips();
});