ngApp.controller('DriverInspectionsController', function($scope, $rootScope, $location, $controller, $location, Api, Auth, SessionUser, $routeParams){

	$scope.success = '';
	$scope.errors = '';

	$scope.fetchInspections = function() {
        Api.send(URLS.driverListInspections, {driver_id: $routeParams.id}, function (data, status) {
            $scope.inspections = data.data.inspections;
        });
    };

    $scope.fetchInspections();
});