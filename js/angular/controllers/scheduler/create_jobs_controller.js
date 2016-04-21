ngApp.controller('SchedulerCreateJobsController', function($scope, $rootScope, $location, $controller, $location, Api, Auth, SessionUser, $routeParams){
    $scope.newJobs = [];
    $scope.company_id = SessionUser.getItem("companyId")
    $scope.mode = 'create';
    $scope.drivers_to_assign = [];
    $scope.general_errors = '';
    $scope.current_run = null;
    $scope.can_manage_scheduler = Auth.authorize(true, ['manage scheduler']);
    $scope.errors = '';
    $scope.success = '';

    $scope.addJob = function() {
        $scope.checkParentAppointments();
        if($scope.appointments.length > 0 && $scope.appointments.length > $scope.newJobs.length){
            $scope.errors = '';
            var driver = null;                
            if ($scope.newJobs.length > 0) {
                driver = _.last($scope.newJobs).user;
            }
            $scope.newJobs.push({id: null, job: null, user: driver});
        }else {
            if($scope.appointments.length == 0){ 
                $scope.errors = 'There is no more appointments to assign.';
            }else {
                $scope.errors = 'Number of new jobs is equal to the amount of available appointments.';
            };
        }
    };

    $scope.removeJob = function(j) {
        $scope.newJobs = _.without($scope.newJobs, j);
        if($scope.newJobs.length == 0){
            $scope.errors = '';
        };
    };

    $scope.cancel = function() {
        $scope.newJobs = [];
        $scope.mode = 'create';
        $scope.changeCreateRunSize(false);
    };

    $scope.changeCreateRunSize = function (resize) {
            if (resize) {
                $('.jobs-container').css('height', 'calc(40%)');
                $('.create-run').css('height', 'calc(60%)');
            } else {
                $('.jobs-container').css('height', 'calc(100% - 25px)');
                $('.create-run').css('height', '25px');
            }

            //adjustPanelsSizes();
        }

    $scope.save = function(createNew) {
        $scope.errors = '';
        angular.forEach($scope.newJobs, function(j){
            j.errors = '';
        });
        $scope.general_errors = '';

        // Copy jobs to avoid circular exception in JSON
        var jobsArray = [];
        angular.forEach($scope.newJobs, function(j){
            var jo = angular.copy(j);
            jobsArray.push(jo);
        });
        if(jobsArray.length)
        {
             Api.send(URLS.saveNewJobs, {date: $scope.$parent.mainDate, jobs: jobsArray}, function (data, status) {                    
                if (data.status) {
                    $scope.mode = 'create';
                    if (createNew == true) {
                        $scope.newJobs = [];                            
                    } else {
                        $scope.newJobs = [];
                        $scope.changeCreateRunSize(false);
                    }
                } else {

                    $scope.newJobs = data.data.jobs;
                    $scope.errors = data.errors.join(', ');
                }  
                $scope.$parent.fetchSchedulerDataForDate();
                $scope.fetchSchedulerDataToAllocate(null);                  
            });
        }
    };
    $scope.fetchDrivers = function() {
        Api.send(URLS.driversList, {date: $scope.$parent.mainDate}, function (data, status) {
            if (data.status) {
                $scope.drivers = data.data.drivers;
                
            }
        });
    };

    $scope.checkParentAppointments = function() {
        if($scope.$parent.deletedJobs){
            $scope.fetchSchedulerDataToAllocate();
        }
    };

    $scope.fetchSchedulerDataToAllocate = function(callback) {
        Api.send(URLS.fetchSchedulerDataToAllocate, {date: $scope.$parent.mainDate}, function (data, status) {
            if (data.status) {
                //$scope.drivers = data.data.drivers;
                $scope.appointments = data.data.appointments;
                $scope.$parent.deletedJobs = false;
            }
            if (callback != null) {
                callback();
            }
        });
    };

    $scope.$parent.$parent.$watch('deletedJobs', function(deletedJobs){
            $scope.fetchSchedulerDataToAllocate();
        });

    $scope.fetchDrivers();
    if($scope.can_manage_scheduler == 1){
        $scope.fetchSchedulerDataToAllocate();
    } 
});

function formatTime(inputField, e, action) {
    var value = $(inputField).val();
    formatted = false;
    if (e.keyCode != 8 && value.length >= 2 &&  false == (value.indexOf(':') > 0)) {
        if(value[0]>='2')
        {   
            if(value[0]>'2' || value[1]>'3')
            {
                value = '23:59';
                formatted = true;
            }
        }
        if((value[2] == ':' && value[3]>'5') || (value[2] != ':' && value[2] > '5'))
        {   
            formatted = true;
            value = value.substr(0, 2) + ':59';
        }
        if(!formatted)
        {
           value = value.substr(0, 2) + ':' + value.substr(2); 
        }
        
        $(inputField).val(value);
    }                

    if (action == 'blur') {
        for (var i =value.length+1; i<=5; i++) {
            if (i == 3) {
                value += ':';
            } else {
                value += '0';
            }        
        }
    }

    if (value.length > 4) {
        $(inputField).val(value.substr(0, 5));
    }
};