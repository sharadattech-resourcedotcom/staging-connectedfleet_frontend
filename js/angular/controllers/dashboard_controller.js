ngApp.controller("DashboardController", function($scope, $location, $timeout, Api, $controller, $http, SessionUser) {	
	angular.extend(this, $controller('BaseController', {$scope: $scope}));
	$scope.appLink = SessionUser.getItem('appLink');
	
});