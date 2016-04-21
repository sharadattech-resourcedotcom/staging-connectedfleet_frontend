ngApp.controller('DriverEditController', function($scope, $rootScope, $location, $controller, $location, Api, Auth, SessionUser, $routeParams){

	$scope.success = '';
	$scope.errors = '';
	$scope.pass_success = '';
	$scope.pass_errors = '';
	$scope.must_know_pass = (Auth.authorize(true, ['change driver password without current']) == 1)?false:true;
	$scope.can_update = (Auth.authorize(true, ['update driver details']) == 1)?true:false;
	$scope.can_manage_types = (Auth.authorize(true, ['manage drivers types']) == 1)?true:false;


    $scope.changePassword = function() {
	    Api.send(URLS.changeDriverPassword, {driver_id: $routeParams.id, newpassword: $scope.newpassword }, function (data, status) {
	        if (data.status) {
	            $scope.pass_success = 'Password successfully changed.';
	            $scope.pass_errors = '';
	            document.getElementById('changePasswordForm').reset();
	        } else {
	            $scope.pass_errors = data.errors.join(", ");
	            $scope.pass_success = '';
	        }
	    });
   	};

   	$scope.saveDriver = function() {
		Api.send(URLS.updateDriver, {driver: $scope.driver}, function (data, status) {
			$scope.$parent.foo = $scope.driver.email;
			if(data.status) {
				$scope.success = 'Driver details successfully changed.';
				$scope.errors = '';
			} else {
				$scope.success = '';
				$scope.errors = data.errors.join(', ');
			}
		});
	};

    $scope.fetchTypes = function(){
	    Api.fetch(URLS.fetchDriversTypes, function (data,status){     
	        $scope.drivers_types = data.data.types;
	        $scope.branches = data.data.branches;
	    });
    };


	$scope.archiveUser = function() {
		$('#confirm').modal('show').one('click', '#archive', function() {
            Api.send(URLS.archiveUser, {user_id: $scope.driver.id}, function (data, status){
            	if(data.status) {
					$location.path('/drivers/list');
				} else {
					$scope.success = '';
					$scope.errors = data.errors.join(', ');
				}
            });
        });
	};

	if($scope.can_manage_types){
		$scope.fetchTypes();
	}

	$scope.driver = $scope.$parent.driver;
});