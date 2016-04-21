ngApp.controller("AppointmentsListController",function($scope, $location, $routeParams, $timeout, Api, $filter, $controller){

    $scope.appointments = [];
    $scope.searchForm = {branch_id: null, product_id: null, insurance_company_id: null, vehicle_id: null};
    $scope.currentPage = 1;
    $scope.pageSize = 100;
    $scope.success = '';
    $scope.errors = '';


    $scope.resetForm = function() {
        $scope.searchForm = {branch_id: null, product_id: null, insurance_company_id: null, vehicle_id: null};
        $scope.searchAppointments(1);
    };

     $scope.fetchAppointmentPreData = function(){
       Api.fetch(URLS.fetch_appointments_pre_data, function (data, status) {
            $scope.appointmentPreData = data.data;
            $scope.searchAppointments(1);
        });
    };

    $scope.searchAppointments = function(page) {
        Api.send(URLS.appointments_list, {page: page, search: $scope.searchForm}, function (data, status) {
            $scope.currentPage = page;
            $scope.totalItems = data.data.count;
            $scope.appointments = data.data.appointments;     
        });
    };   


    $scope.redirectToCreateAppointment = function() {
        $location.path("/appointments/create");
    };  

    $scope.fetchAppointmentPreData();

});