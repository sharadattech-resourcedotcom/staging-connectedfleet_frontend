ngApp.controller("AppointmentDetailsController",function($scope, $location, $routeParams, $timeout, Api, $filter, $controller){

	$scope.success = '';
    $scope.errors = '';
    $scope.imgsrc = URLS.damage_item_src;

    $scope.fetchDetails = function() {
        Api.fetch(URLS.appointment_details.replace(':id', $routeParams.id), function (data, status) {
            $scope.appointment = data.data.appointment;
            $scope.not_changed_appointment = angular.copy($scope.appointment);
            $scope.inspections = data.data.inspections;
            $scope.driver = data.data.driver;
            $scope.success = '';
            $scope.errors = '';
        });
    };

    $scope.fetchAppointmentPreData = function(){
       Api.fetch(URLS.fetch_appointments_pre_data, function (data, status) {
            $scope.appointmentPreData = data.data;
            $scope.fetchDetails();
        });
    };

    $scope.resetForm = function() {
        $scope.appointment = angular.copy($scope.not_changed_appointment);
    };

    $scope.updateAppointment = function() {
        Api.send(URLS.appointment_update, {appointment: $scope.appointment}, function (data, status) {
             if(data.status){
                $scope.success = 'Appointment successfully updated.';
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

    $scope.fetchAppointmentPreData();
});