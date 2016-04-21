ngApp.controller('InspectionsListController', function($scope, $rootScope, $location, $controller, $location, Api, Auth, SessionUser, $routeParams){

	$scope.success = '';
	$scope.errors = '';
	$scope.filter = '';

	$scope.fetchInspections = function() {
        Api.send(URLS.inspections_list, {}, function (data, status) {
            $scope.inspections = data.data.inspections;
        });
    };

    $scope.fetchInspections();
});