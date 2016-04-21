ngApp.controller('DriverPreviousPeriodDetailsController', function($scope, $rootScope, $location, $controller, $location, Api, Auth, SessionUser, $routeParams){

    $scope.success = '';
    $scope.errors = '';
    $scope.canChange = (Auth.authorize(true, ['change period start mileage']) == 1)?true:false;

	$scope.redirectToTripDetails = function(id){
	    $location.path('/trips/' + id.toString());
	};

	$scope.refreshPeriodMileage = function(){
        Api.send(URLS.refreshPeriodMileage, {period_id: $routeParams.period_id, driver_id: $scope.driver.id}, function (data, status) {         
            Api.send(URLS.listTrips, {period_id: $routeParams.period_id, driver_id: $routeParams.id}, function (data, status) {
                    $scope.previousPeriodTrips = data.data.trips;
                    if (data.status) {
                        $scope.errors = '';
                        $scope.success = 'Period successfully refreshed';
                    } else {

                        $scope.errors = data.errors.join(", ");
                        $scope.success = '';
                    }   
            });
        });
    };

    $scope.showTripsFromPeriod = function(){
	    $scope.isLastClosedPeriod();
	   Api.send(URLS.listTrips, {period_id: $routeParams.period_id, driver_id: $scope.driver.id}, function (data, status) {
				$scope.previousPeriodTrips = data.data.trips;
	   });		
	};

	$scope.isLastClosedPeriod = function(){
	    Api.send(URLS.isLastClosedPeriod, {period_id: $routeParams.period_id, driver_id: $scope.driver.id}, function (data, status) {
            if(data.data == true)
            {
                 $scope.reopenButton = true;
            }
            else
            {
                 $scope.reopenButton = false;
            } 
	    });
	};

    $scope.reopenPeriod = function(){
        var modal = $('#myModal');
        var answer = confirm("Please confirm that you want to reopen that period. Please remember that currently opened period will be removed and all its trips will be moved to the period you reopen");
        if(answer == true)
        {
            Api.send(URLS.reopenPeriod, {period_id: $routeParams.period_id}, function (data, status) {
                $location.path("/drivers/"+$routeParams.id+"/currentPeriod")
            });
        }
    };

    $scope.fetchPeriod = function(){
        Api.send(URLS.fetchPeriod, {period_id: $routeParams.period_id, driver_id: $scope.driver.id}, function (data, status) {
                $scope.period = data.data.period;
       });  
    };

    $scope.approvePeriod = function(){
        Api.send(URLS.approvePeriod, {period_id: $routeParams.period_id}, function (data, status) {
             if (data.status) {
                    $scope.errors = '';
                    $scope.success = 'Period approved.';
                    $scope.fetchPeriod();
                } else {

                    $scope.errors = data.errors.join(", ");
                    $scope.success = '';
                }   
       }); 
    };

    $scope.changePeriodStartMileage = function() {
        Api.send(URLS.changePeriodStartMileage, {period: $scope.period}, function (data, status) {
            if (data.status == true) {
                $scope.success = 'Period start mileage has been changed.';
                $scope.errors = '';
            } else {
                $scope.success = '';
                $scope.errors = data.errors.join(", ");
            }
        });
    }

	Api.send(URLS.driverDetails, {driver_id: $routeParams.id }, function (data, status) {
            $scope.driver = data.data.driver;  
            $scope.showTripsFromPeriod();
            $scope.fetchPeriod();
    });
   
});