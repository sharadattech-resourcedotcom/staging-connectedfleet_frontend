ngApp.controller("VehiclesAccessController", function($scope, $location, $timeout, Api, $controller, $http) {	
	angular.extend(this, $controller('BaseController', {$scope: $scope}));
    $scope.success = '';
    $scope.errors = '';
    $scope.company_vehicles = [];
    $scope.available_vehicles = [];
    $scope.user_vehicles = [];
    $scope.users = [];
    $scope.user_id;

    $scope.removeFromUser = function (vehicle){
        $scope.user_vehicles = _.without($scope.user_vehicles, _.findWhere($scope.user_vehicles, {id: vehicle.id}));
        $scope.available_vehicles.push(vehicle);
    };

    $scope.addToUser = function (vehicle){
        $scope.available_vehicles = _.without($scope.available_vehicles, _.findWhere($scope.available_vehicles, {id: vehicle.id}));
        $scope.user_vehicles.push(vehicle);
    };

    $scope.fetchUsersAndVehicles = function (){
        Api.fetch(URLS.fetchVehiclesAccessUsers, function (data, status){
            $scope.users = data.data.users;
            $scope.company_vehicles = data.data.vehicles;
            $scope.available_vehicles = angular.copy($scope.company_vehicles);
        });
    };

    $scope.changeUser = function (){
        Api.send(URLS.fetchUserVehicles, {user_id: $scope.user_id}, function (data, status){
            $scope.user_vehicles = data.data.vehicles;
            $scope.available_vehicles = angular.copy($scope.company_vehicles);
            angular.forEach($scope.user_vehicles, function(v, index){
                $scope.available_vehicles = _.without($scope.available_vehicles, _.findWhere($scope.available_vehicles, {id: v.id}));
            });     
        });
    };

    $scope.saveUserVehicles = function (){
        Api.send(URLS.sendUserVehicles, {user_id: $scope.user_id, vehicles: $scope.user_vehicles}, function (data, status){
            if(data.status)
            {
                
            }
            else
            {
                $scope.errors = data.errors.join(', ');
            }
        });
    };

    $scope.fetchUsersAndVehicles();
    
    $('.nav-tabs li').removeClass('active');
    $('.nav-tabs li.vehicles_access').addClass('active');
});
