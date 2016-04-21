ngApp.controller("ManagersController", function($scope, $location, $timeout, Api, $controller, $http) {	
	angular.extend(this, $controller('BaseController', {$scope: $scope}));

    $scope.success = '';
    $scope.errors = '';
    $scope.driver = null;
    $scope.manager_id = null;
    $scope.filteredManagers = [];

    $scope.fetchData = function (){
        Api.fetch(URLS.fetchDriversAndManagers, function (data,status){     
            $scope.drivers = data.data.drivers;
            $scope.managers = data.data.managers;
        });
    };

    $scope.changeDriver = function (){
        $scope.manager_id = $scope.driver.manager_id;
        $scope.filteredManagers =  _.without($scope.managers, _.findWhere($scope.managers, {id: $scope.driver.id}))
    };

    $scope.assign = function(){
        Api.send(URLS.assigManagerToDriver, {driver_id: $scope.driver.id, manager_id: $scope.manager_id}, function (data, status){
            if(data.status){
                $scope.success = 'Manager successfully changed.';
                $scope.errors = '';
            } else {
                $scope.success = '';
                $scope.errors = data.errors.join(', ');
            };
        });
    };

    $scope.fetchData();

    $('.nav-tabs li').removeClass('active');
    $('.nav-tabs li.settings').addClass('active');
});