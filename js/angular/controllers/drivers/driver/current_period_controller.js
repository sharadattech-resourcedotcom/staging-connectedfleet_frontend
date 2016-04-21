ngApp.controller('DriverCurrentPeriodController', function($scope, $rootScope, $location, $filter, $controller, $location, $uibModal, Api, Auth, SessionUser, DetectBrowser, $routeParams){
	   angular.extend(this, $controller('BaseController', {$scope: $scope}));

    $scope.success = '';
    $scope.errors = '';
    $scope.thicked_checkbox = false;
    $scope.mode = 'normal';    
    $scope.canChange = (Auth.authorize(true, ['change period start mileage']) == 1)?true:false;
    $scope.supportDate = true;

    $scope.switchMode = function(m) {
        $scope.mode = m;

        if ($scope.mode == 'close') {
            $scope.closePeriod();
        }
    }

	$scope.createTrip = function(p) {
		var modal = $('.create-trip-form');
        modal.find('input').val('');
        $scope.switchMode('createTrip'); 
		modal.find('input[name="period_start_date"]').val(p.start_date);
		modal.find('input[name="user_id"]').val(p.user_id);
		$scope.errors = '';
        $scope.success = '';
	}

    $scope.refreshPeriodMileage = function(period) {
	    Api.send(URLS.refreshPeriodMileage, {period_id: period.id, driver_id: $scope.driver.id}, function (data, status) {
            Api.send(URLS.currentPeriod, {driver_id: $routeParams.id}, function (data, status) {
                    $scope.currentPeriod = data.data.period;
                    if (data.status) {
                        $scope.errors = '';
                        $scope.success = 'Period successfully refreshed.';
                    } else {

                        $scope.errors = data.errors.join(", ");
                        $scope.success = '';
                    }
                });
        });
    }
		
	$scope.submitTrip = function() {
		var modal = $('.create-trip-form');
        trip = modal.find('form').serializeFormJSON();
        if($filter('date')(trip.start_date) > $filter('date')(trip.end_date)){
            $scope.errors = 'End date must be after the start date!';
        } else{
    		Api.send(URLS.createTrip,{trip: trip, period: $scope.currentPeriod}, function (data, status) {
    			if (data.status == false) {
    				$scope.errors = data.errors.join(", ");
                    $scope.success = '';
    			} else {
                    $scope.errors = '';
                    $scope.mode = 'normal';
    				$scope.getTrips();                
    			}
    		});
        }
	}

	$scope.getCurrentPeriod = function()   {
	    Api.send(URLS.currentPeriod, {driver_id: $routeParams.id}, function (data, status) {
	        $scope.currentPeriod = data.data.period;
	        $scope.defaultCurrentPeriod = angular.copy($scope.currentPeriod);
	        $scope.getTrips();
	    });
    };

    $scope.getTrips = function() {
        Api.send(URLS.listTrips, {period_id: $scope.currentPeriod.id}, function (data, status) {
            $scope.trips = data.data.trips;
        });
    };

    $scope.approvePeriod = function() {
       Api.send(URLS.approvePeriod, {driver: $scope.driver, period: $scope.chosenPeriod}, function (data, status) {
		if (data.status == true) {
			$scope.success = 'Period has been approved.';
            $scope.errors = '';
	     	$scope.chosenPeriod.approved = true;
			angular.element('.period-approval').hide();
		} else {
			$scope.success = '';
            $scope.errors = data.errors.join(", ");
		}
       });
	};

    $scope.closePeriod = function() {
        $scope.success = '';
        $scope.errors = '';
        var modal = $('.close-form');
        modal.find('input[name="end_mileage"]').val('');
        modal.find('input[name="period_end_date"]').val('');
        modal.find('input[name="agent_email"]').val('');

        modal.find('span.start-mileage').html('<b>'+ $scope.currentPeriod.start_mileage +'</b>');
        modal.find('span.start-date').html('<b>'+ $scope.currentPeriod.start_date +'</b>');
        modal.find('span.private-mileage').html('<b>'+ $scope.currentPeriod.overall_mileage.private +'</b>');
        modal.find('span.business-mileage').html('<b>'+ $scope.currentPeriod.overall_mileage.business +'</b>');
    };
		  
	$scope.confirmClosingPeriod = function() {
		var modal = $('.close-form');
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
                    // $('.close-form').modal('hide');
                    $scope.currentPeriod = {};
                    $scope.trips = [];
                    angular.element('.trips-list').hide();
                    // $scope.getClosedPeriods();
                    $scope.mode = 'normal';
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

    $scope.changePeriodStartMileage = function() {
        Api.send(URLS.changePeriodStartMileage, {period: $scope.currentPeriod}, function (data, status) {
            if (data.status == true) {
                $scope.success = 'Period start mileage has been changed.';
                $scope.errors = '';
            } else {
                $scope.success = '';
                $scope.errors = data.errors.join(", ");
            }
        });
    }

	$scope.redirectToTripDetails = function(id) {
	    $location.path('/trips/' + id.toString());
	};

	$scope.resetPeriodForm = function(){
	    $scope.currentPeriod = angular.copy($scope.defaultCurrentPeriod);
	};

    $scope.showSecurityCodeModal = function() {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'templates/modals/securityCodeModalTpl.html',
          controller: 'SecurityCodeModalController',
          size: 'sm'
        });
    };

	$scope.choosePeriodEndDate = function(){
        jQuery('input[name="period_end_date"]').datepicker({format: "dd/mm/yyyy", autoclose: true}).datepicker("show");
	};

	Api.send(URLS.driverDetails, {driver_id: $routeParams.id }, function (data, status) {
            $scope.driver = data.data.driver;
            $scope.getCurrentPeriod();   
    });
    var i = document.createElement("period_end_date");
    i.setAttribute("type", "date");
    if (i.type == "text" || DetectBrowser() == 'internet explorer' || DetectBrowser() == 'unknown') {
        $scope.supportDate = false;
        $scope.openCalendar('start_date');
        $scope.openCalendar('end_date');
    }
});