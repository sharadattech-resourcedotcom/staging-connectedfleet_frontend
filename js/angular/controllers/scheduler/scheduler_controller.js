ngApp.controller('SchedulerController', function($scope, $rootScope, $location, $controller, $location, $filter, Api, Auth, SessionUser, $routeParams){
        angular.extend(this, $controller('BaseController', {$scope: $scope}));
    $scope.jobs = [];
    $scope.drivers_summary = [];
    $scope.currentTab = 'drivers';
    $scope.mainDate = $filter('date')(new Date(), "yyyy-MM-dd");
    $scope.driverDetails = null;
    $scope.mapWindow = null;
    $scope.deletedJobs = false;

    $scope.fetchSchedulerDataForDate = function() {
        var topOffset = $('.jobs-container .scrollable-container').scrollTop();

       Api.send(URLS.fetchSchedulerDataForDate, {date: $scope.mainDate}, function (data, status) {
            if (data.status) {
                $scope.jobs = data.data.jobs;
                $scope.drivers_summary = data.data.drivers;
            }
        });
    }            

    $scope.openMapWindow = function() {
        if ($scope.mapWindow == null) {
            $scope.mapWindow = window.open("<%= url_for scheduler_map_view_path %>?date="+$scope.mainDate, "MsgWindow", "fullscreen=yes,menubar=1,resizable=1");
            $scope.mapWindow.onbeforeunload = function() { $scope.mapWindow = null; }
        } else {
            $scope.mapWindow.focus();  
            $scope.mapWindow.reloadWindow();       
        }
    };

    $scope.showDriverJobs = function(d) {
        $scope.driverDetails = d;
        Api.send(URLS.fetchDriverJobs, {date: $scope.mainDate, user_id:d.id}, function (data, status) {
            if (data.status) {
                $scope.driverJobs = data.data.jobs;
                $('#driverModal').modal('show');
            } else {
                alert(data.error);
            }
        });
    }

    $scope.deleteJob = function(job){
        $scope.deletedJobs = false;
        Api.send(URLS.deleteJob, {job: job}, function (data, status) {
            $scope.fetchSchedulerDataForDate();
            $scope.deletedJobs = true;
        });
    };
    $scope.fetchSchedulerDataForDate();

    $scope.openCalendar('date');
});