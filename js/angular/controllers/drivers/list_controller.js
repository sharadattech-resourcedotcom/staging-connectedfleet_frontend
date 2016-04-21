ngApp.controller('DriversListController', function($scope, $rootScope, $location, $controller, $location, Api, $routeParams){
    
    $scope.success = '';
	$scope.errors = '';
    $scope.filter    = '';
	$scope.drivers =  [];
    var createURL    = BACKEND_HOST+'/drivers/create';
    $scope.newdriver = {};

	$scope.createNewDriver = function() {
		Api.send(URLS.createDriver, {driver: $scope.newdriver}, function (data, status) {
            $scope.newdriver = {};
			$scope.list();
			if(data.status) {
				$scope.success = 'Driver successfully created.';
				$scope.errors = '';
				document.getElementById('addDriverForm').reset();
			} else {
				$scope.success = '';
				$scope.errors = data.errors.join(', ');
			}
            
		}); 			
	}

	
	Api.send(URLS.driversList,{}, function (data, status) {
		$scope.drivers = data.data.drivers;
	}); 

    $scope.redirectToDriverDetails = function(id) {
        $location.path('drivers/'+id.toString()+'/currentPeriod');
    };
});