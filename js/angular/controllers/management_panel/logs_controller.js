ngApp.controller("LogsController", function($scope, $location, $timeout, Api, $controller, $http) {	
	angular.extend(this, $controller('BaseController', {$scope: $scope}));

    $scope.searchForm = {};
    $scope.searchForm.succeeded = true;
    $scope.searchForm.not_succeeded = true;
    $scope.logs = [];
    $scope.output = false;
    $scope.success = '';
    $scope.errors = '';

    $scope.fetchLogs = function() {
        Api.send(URLS.fetchLogs, {searchForm: $scope.searchForm}, function (data, status){
            $scope.logs = data.data.logs;
        });
    };

    $scope.changeLog = function(log){
        log.input_val = log.input_val.replace(/\\/g,"");
        log.input_val = log.input_val.replace(/"{/g, "{");
        log.input_val = log.input_val.replace(/\}"/g, "}");
        $scope.chosenLog = log;

        $("html, body").animate({ scrollTop: 0 }, "fast");
    };

    $scope.changeTab = function(tab) {
        if(tab == 'input')
        {
            $scope.output = false;
            $('#side-navbar li').removeClass('active');
            $('#side-navbar li.input').addClass('active');
        }
        else
        {
            $scope.output = true;
            $('#side-navbar li').removeClass('active');
            $('#side-navbar li.output').addClass('active');
        }
    };

    $scope.synchronizeLog = function(){
        $scope.success = '';
        $scope.errors = '';
        Api.send(BACKEND_HOST+'/synchronize_log', {data: $scope.chosenLog.input_val, log_id: $scope.chosenLog.id,  app_version: $scope.chosenLog.app_version}, function (data, status) {
            if(data.status) {
                $scope.success = 'Synchronization succeeded.';
                $scope.errors = '';
                $scope.fetchLogs();
            } else {
                $scope.success = '';
                $scope.errors = data.errors.join('  ');
            }
        });
    };

    // $scope.openCalendar = function(name) {
    //           jQuery('input[name="'+ name + '"]').datetimepicker({format: 'Y-m-d', timepicker: false});
    //     };

    $scope.fetchLogs();
    $('.nav-tabs li').removeClass('active');
    $('.nav-tabs li.logs').addClass('active');
    $('#side-navbar li.input').addClass('active');
    $scope.openCalendar('date_to');
    $scope.openCalendar('date_from');
});