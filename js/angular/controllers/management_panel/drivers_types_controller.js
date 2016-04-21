ngApp.controller("DriversTypesController", function($scope, $location, $timeout, Api, $controller, $http) {	
	angular.extend(this, $controller('BaseController', {$scope: $scope}));

    $scope.success = '';
    $scope.errors = '';
    $scope.driver_type = {};
    
    $scope.fetchTypes = function(){
        Api.fetch(URLS.fetchDriversTypes, function (data,status){     
            $scope.drivers_types = data.data.types;
        });
    };

    $scope.saveType = function(){
         Api.send(URLS.saveDriverType, {type: $scope.driver_type}, function (data, status) { 
            if(data.status){
                $scope.success = 'Driver type successfully saved.';
                $scope.errors = '';
            } else {
                $scope.success = '';
                $scope.errors = data.errors.join(', ');
            }                 
        });
    };

    $scope.fetchTypes();

    $('.nav-tabs li').removeClass('active');
    $('.nav-tabs li.settings').addClass('active');
});