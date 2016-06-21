ngApp.controller("AppointmentCreateController",function($scope, $location, $routeParams, SessionUser, $timeout, Api, $filter, $controller){

	$scope.success = '';
    $scope.errors = '';
    $scope.appointment = {};
    $scope.secondAddress = SessionUser.isFromGemini();

    $scope.resetForm = function() {
        $scope.searchForm = {registration: null, manufacturer_id: null, model_id: null, fleet_type: null, body_code: null, transmission: null, fuel_type: null, colour: null };
    };

    $scope.fetchAppointmentPreData = function(){
       Api.fetch(URLS.fetch_appointments_pre_data, function (data, status) {
            $scope.appointmentPreData = data.data;
        });
    };

	$scope.saveAppointment = function(){
        Api.send(URLS.appointment_create, {appointment: $scope.appointment}, function (data, status) {
            $("html, body").animate({ scrollTop: 0 }, "fast");
            if (data.status) {
               $scope.errors='';
               $scope.success = "Appointment successfully created."
               $scope.appointment = null;
               $location.path("/appointments");
            } else {
                $scope.errors = data.errors.join(', ');
                $scope.success = '';
            }
        });
    };  

    $scope.fetchAppointmentPreData();

});