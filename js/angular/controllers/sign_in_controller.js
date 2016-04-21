ngApp.controller("SigninController", function($scope, $location, $timeout, $routeParams, Api, SessionUser, $controller, $http) {	
	angular.extend(this, $controller('BaseController', {$scope: $scope}));

	$scope.user = {login: '', password: ''};
	$scope.error = '';
	$scope.isLoading = false;

	$scope.signin = function() {
		$scope.error = '';
		$scope.isLoading = true;
		
		Api.send(BACKEND_HOST, {user: $scope.user}, function(data, status) {
			$scope.isLoading = false;
			if (status == 200) {
				if (data.status) {
					SessionUser.signin(data.data.user, data.data.token, data.data.app);						
				} else {
					$scope.error = data.errors;
				}
			} else {
				$scope.error = 'Sorry but API request failed';
			}
		});
	};

	if ($location.path().indexOf('authentication_fail') > -1) {
        $scope.error = 'Authentication fail. Please sign in.';
    }
});