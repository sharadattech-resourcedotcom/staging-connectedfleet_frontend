ngApp.controller("ApprovePeriodController", function($scope, $location, $timeout, Api, $controller, $routeParams) {	
	angular.extend(this, $controller('BaseController', {$scope: $scope}));
    $scope.success = '';
	$scope.errors = '';
	$scope.approved = false;


	$scope.periodDetails = function(){
		Api.send(URLS.fetchPeriodToApproveDetails, {period_id: $routeParams.id, approve_token: $routeParams.token }, function (data, status) {
			if(data.status) {
				$scope.period = data.data.period;
				$scope.trips = data.data.trips;
				$scope.driver = data.data.driver;
				console.log($scope.period);
			} else {
				$scope.success = '';
				$scope.errors = data.errors.join(', ');
			}
		});
	};

	$scope.approvePeriod = function (){
		Api.send(URLS.approvePeriodByToken, {period_id: $scope.period.id, approve_token: $routeParams.token}, function (data, status){
			if(data.status) {
				$scope.approved = true;
				$scope.success = 'Period has been approved. You can now close this browser window.';
				$scope.errors = '';
			} else {
				$scope.success = '';
				$scope.errors = data.errors.join(', ');
			}
		});
	};

	$scope.periodDetails();
	
});