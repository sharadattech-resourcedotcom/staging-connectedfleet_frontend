ngApp.controller('PeriodsToApproveController', function($scope, $rootScope, $location, $controller, $location, Api, $routeParams){
    
    $scope.success = '';
	$scope.errors = '';
   
   $scope.fetchPeriodsToApprove = function(){
   		Api.fetch(URLS.fetchPeriodsToApprove, function (data, status){
   			$scope.periods = data.data.periods;
   		});
   };

   $scope.fetchPeriodsToApprove();
});