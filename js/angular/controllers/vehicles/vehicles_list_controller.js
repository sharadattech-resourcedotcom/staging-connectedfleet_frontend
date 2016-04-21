ngApp.controller("VehiclesListController",function($scope, $location, $timeout, Api, $filter, $controller){
    $scope.vehicles = [];
    $scope.searchForm = {registration: null, manufacturer_id: null, model_id: null, fleet_type: null, body_code: null, transmission: null,
                        fuel_type: null, colour: null };
    $scope.vehicle = {registration: null, manufacturer_id: null, model_id: null, fleet_type: null, body_code: null, transmission: null,
                        fuel_type: null, colour: null};
    $scope.currentPage = 1;
    $scope.pageSize = 100;
    $scope.success = '';
    $scope.errors = '';


    $scope.resetForm = function() {
        $scope.searchForm = {registration: null, manufacturer_id: null, model_id: null, fleet_type: null, body_code: null, transmission: null, fuel_type: null, colour: null };
        $scope.searchVehicles(1);
    };

     $scope.fetchVehiclePreData = function(){
       Api.fetch(URLS.fetch_vehicles_pre_data, function (data, status) {
            $scope.vehiclePreData = data.data;
            $scope.searchVehicles(1);
        });
    };

    $scope.searchVehicles = function(page) {
        Api.send(URLS.vehicles_list, {page: page, search: $scope.searchForm}, function (data, status) {
            $scope.currentPage = page;
            $scope.totalItems = data.data.count;
            $scope.vehicles = data.data.vehicles;          
        });
    };   

    $scope.redirectToCreateVehicle = function() {
            $location.path("/vehicles/create");
        };  

    $scope.saveVehicle = function(){
        Api.send(URLS.vehicle_create, {vehicle: $scope.vehicle}, function (data, status) {
            if (data.status) {
                $("html, body").animate({ scrollTop: 0 }, "fast");
               $scope.errors='';
               $scope.success = "Vehicle successfully created."
               $scope.vehicle = null;
            } else {
                $("html, body").animate({ scrollTop: 0 }, "fast");
                $scope.errors = data.errors.join(', ');
                $scope.success = '';
            }
        });

    };  

   $scope.fetchVehiclePreData();
});