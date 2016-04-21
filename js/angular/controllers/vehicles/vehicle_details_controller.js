ngApp.controller("VehicleDetailsController",function($scope, $location, $routeParams, $timeout, Api, Auth, $filter, $controller){

	$scope.success = '';
    $scope.errors = '';
    $scope.filter = '';
    $scope.manufacturer_edit = false;
    $scope.model_edit = false;
    $scope.can_update = (Auth.authorize(true, ['update vehicles']) == 1)?true:false;

    $scope.unknownManufacturer = function(){
        if($scope.vehicle.manufacturer.description == 'Unknown'){
            return true;
        }else {
            return false;
        }
    };

    $scope.unknownModel = function(){
        if($scope.vehicle.model.description == 'Unknown'){
            return true;
        }else {
            return false;
        }
    };

    $scope.fetchVehiclePreData = function(){
       Api.fetch(URLS.fetch_vehicles_pre_data, function (data, status) {
            $scope.vehiclePreData = data.data;
            $scope.fetchDetails();
            $scope.success = '';
            $scope.errors = '';
        });
    };

    $scope.fetchDetails = function() {
	    Api.fetch(URLS.vehicle_details.replace(':id', $routeParams.id), function (data, status) {
	    	$scope.vehicle = data.data.vehicle;
            $scope.manufacturer_edit = $scope.unknownManufacturer();
            $scope.model_edit = $scope.unknownModel();
	    	$scope.edit_vehicle = angular.copy($scope.vehicle);
	    });
    };

    $scope.fetchAppointments = function() {
        Api.send(URLS.appointments_list, {vehicle_id: $routeParams.id}, function (data, status) {
            $scope.appointments = data.data.appointments;
        });
    };

    $scope.fetchInspections = function() {
        Api.send(URLS.inspections_list, {vehicle_id: $routeParams.id}, function (data, status) {
            $scope.inspections = data.data.inspections;
        });
    };

    $scope.resetForm = function() {
    	$scope.edit_vehicle = angular.copy($scope.vehicle);
    };

    $scope.updateVehicle = function() {
    	Api.send(URLS.vehicle_update, {vehicle: $scope.edit_vehicle}, function (data, status) {
    		 if(data.status){
                $scope.fetchDetails();
                $scope.success = 'Vehicle successfully updated.';
                $scope.errors = '';
            } else {
                $scope.success = '';
                $scope.errors = data.errors.join(', ');
            };
            $("html, body").animate({ scrollTop: 0 }, "fast");
    	});
    };

    $scope.getClass = function (path) {
        if ($location.path().indexOf(path) > -1) {
            return 'active';
        } else {
            return '';
        }
    }

    $scope.fetchVehiclePreData();
    $scope.fetchInspections();
    $scope.fetchAppointments();

    $timeout(function(){
        var lineData = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "Example dataset",
                    fillColor: "rgba(220,220,220,0.5)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: "Example dataset",
                    fillColor: "rgba(26,179,148,0.5)",
                    strokeColor: "rgba(26,179,148,0.7)",
                    pointColor: "rgba(26,179,148,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(26,179,148,1)",
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        var lineOptions = {
            scaleShowGridLines: true,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            bezierCurve: true,
            bezierCurveTension: 0.4,
            pointDot: true,
            pointDotRadius: 4,
            pointDotStrokeWidth: 1,
            pointHitDetectionRadius: 20,
            datasetStroke: true,
            datasetStrokeWidth: 2,
            datasetFill: true,
            responsive: true,
        };


        var ctx = document.getElementById("lineChart").getContext("2d");
        var myNewChart = new Chart(ctx).Line(lineData, lineOptions);
        var ctx = document.getElementById("lineChart2").getContext("2d");
        var myNewChart = new Chart(ctx).Line(lineData, lineOptions);
    }, 300);
});