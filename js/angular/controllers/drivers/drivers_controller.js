ngApp.controller('DriversController', function($scope, $rootScope, $location, $controller, $location, Api, Auth, SessionUser, $routeParams){

	$scope.can_see_list = Auth.authorize(true, ['see drivers list']);
	$scope.currentPeriod = {};
	// $scope.choosePeriodEndDate = function(){
	//     //$('input[name="period_end_date"]').datetimepicker("show");
 //        jQuery('input[name="period_end_date"]').datepicker({format: "dd/mm/yyyy", autoclose: true}).datepicker("show");
	// };

	$scope.closePeriod = function() {
        var modal = $('#myModal');
        modal.find('span.start-mileage').html('<b>'+ $scope.currentPeriod.start_mileage +'</b>');
        modal.find('span.start-date').html('<b>'+ $scope.currentPeriod.start_date +'</b>');
        modal.find('span.private-mileage').html('<b>'+ $scope.currentPeriod.overall_mileage.private +'</b>');
        modal.find('span.business-mileage').html('<b>'+ $scope.currentPeriod.overall_mileage.business +'</b>');
        modal.find('input[name="period_end_date"]').datetimepicker({format: 'Y-m-d', timepicker: false});

        $('#myModal').modal('show');
    };
		  
	$scope.confirmClosingPeriod = function() {
		var modal = $('#myModal');
        var r = confirm("You are closing the period on "+ modal.find('input[name="period_end_date"]').val() + " - are you sure you want to close at this date?");
        if (r == true) {
            Api.send(URLS.closePeriod, 
            {
                driver_id: $routeParams.id, 
                end_mileage: modal.find('input[name="end_mileage"]').val(),
                period_end_date: modal.find('input[name="period_end_date"]').val(),
                agent_email: modal.find('input[name="agent_email"]').val(),
                period: $scope.currentPeriod
            }, function (data, status) {
                if (data.status == true) {
                    $('#myModal').modal('hide');
                    $scope.currentPeriod = {};
                    $scope.trips = [];
                    angular.element('.trips-list').hide();
                    $scope.getClosedPeriods();
                    $scope.getCurrentPeriod();
                    $scope.success = 'Thank you for closing your last month. The log has gone to your line manager for authorisation and the deduction will be calculated and reported back to you prior to being submitted to payroll.'
                    $scope.errors = '';
                } else {
                    $scope.errors = data.errors.join(",");
                    $scope.success = '';
                }
            });
        }				
	};

	$scope.getClass = function (path) {
      if ($location.path().indexOf(path) > -1) {
        return 'active';
      } else {
        return '';
      }
    }

});