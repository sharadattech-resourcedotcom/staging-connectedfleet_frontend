ngApp.controller("TripDetailsController",function($scope, $routeParams, $location, Api, Auth, $timeout, $filter, SessionUser) {
    $scope.setDirectiveFn= function(mapInit, setMarker) {
        $scope.mapInit = mapInit;
        $scope.setMarker = setMarker;
    };
    $scope.colors = ['#97bbcd','#dcdcdc','#949fb1','#68F000'];
    $scope.fractions = [3, 5, 10, 15, 30, 60];    
    $scope.chartOpts = {fraction: 3, fuel: true, speed: true, rpm: true};    
    $scope.chart = null;     
    $scope.loader = false;
    $scope.can_update = Auth.authorize(true, ['update trips details']);
    $scope.can_change_status = Auth.authorize(true, ['change trips status']);
    $scope.activeTab = 'map';
    $scope.activeRightTab = 'edit';
    $scope.statuses = ['active','paused','finished'];
    $scope.trip = {};
    $scope.tripDefaults = {};
    var points = [];
    var pointsHtml = "";
    $scope.selectedPeriodId = null;

    //temporary function
    dateDiff = function(start_date, end_date) {
        if (end_date != null) {
            return moment.duration(moment(end_date) - moment(start_date)).humanize();
        } else {
            return "";
        }
    };

    createPointsHtml = function(points) {
         html_string = "<a  class='btn btn-primary pull-right' href='" + $scope.download_path +"'><i class='fa fa-file-excel-o'></i> Download points report</a>" + 
            "<table class='table table-bordered'><thead>" +
            "<th>Date</th>" +
            "<th>Lat</th>" +
            "<th>BT</th>" +
            "<th>Don.</th>" +
            "<th>Vehicle Speed</th>" +
            "<th>Acceleration</th>" +
            "<th>RPM</th>" +
            "<th>Fuel</th>" +
            "<th>Beh. Points</th>" +
            "<th>Actions</th></thead>";

        _.forEach(points, function(p){
            html_string += "<tr>";
            html_string += "<td>" + $filter('utcdatetime')(p.timestamp) + "</td>"
            html_string += "<td>" + p.latitude + "<br/>" + p.longitude + "</td>";
            html_string += "<td>" + p.bt + "</td>";
            html_string += "<td>" + p.dongle + "</td>"
            if (p.vehicle_speed == -1) {
                html_string += "<td><span>--/--</span></td>";
            } else {
                html_string += "<td><span>" + $filter('number')(p.vehicle_speed / 1.609, 0) + "</span> mph</td>";
            }
            if (p.acceleration == -1) {
                html_string += "<td><span>--/--</span></td>";
            } else {
                html_string += "<td><span>" + $filter('number')(p.acceleration / 1.609, 2) + "</span></td>";
            }
            if (p.rpm == -1) {
                html_string += "<td><span>--/--</span></td>";
            } else {
                html_string += "<td><span>" + $filter('number')(p.rpm, 0) + "</span> rpm</td>";
            }
            if (p.fuel_economy == -1 ) {
                html_string += "<td><span>--/--</span></td>";
            } else {
                html_string += "<td><span>" + $filter('number')(p.fuel_in_mpg, 1 ) + "</span> mpg</td>";
            }
            if (p.behaviour_points > 0) {
                html_string += "<td><i class='fa fa-thumbs-down red'></i>" + p.behaviour_points + "</td>";
            } else {
                html_string += "<td><i class='fa fa-thumbs-up green'></i>" + p.behaviour_points + "</td>";
            }
            html_string += "<td><button onclick='setMarker(" + p.latitude + "," + p.longitude +")'>Show</button></td></tr>"
        });
        html_string += "</table>"
        pointsHtml = html_string;
    };

    $scope.getChartData = function() {
       Api.send(URLS.charts + $routeParams.id, $scope.chartOpts, function (data, status) {
            $scope.chart = data.chart;
        });
    };

    setMarker = function(lat,lng) {
        $scope.setMarker(lat, lng);
    };

    $scope.init = function() {
        $scope.loader = true;
        Api.send(URLS.tripDetails, {id: $routeParams.id}, function (data, status) {
            $scope.trip = data.data.trip;
            $scope.redValue = data.data.lines.red_value * 1.609;
            $scope.orangeValue = data.data.lines.orange_value * 1.609;
            $scope.stats = data.data.stats;
            $scope.lastPeriods = data.data.last_five_periods;
            $scope.trip.time = dateDiff($scope.trip.start_date, $scope.trip.end_date);
            $scope.tripDefaults = angular.copy($scope.trip);
            $scope.mapInit($scope.trip);
            $scope.loader = false;
        });
    };

    $scope.getTripPoints = function (check) {
        if (check && points.length) {
            return;
        };

        $scope.loader = true;
         Api.send(URLS.tripPoints, {id: $routeParams.id }, function (data) {
            points = data.data.points;
            $scope.download_path = BACKEND_HOST + "/trips/download_points_xls?trip_id="+$routeParams.id+"&token="+SessionUser.getItem("access_token")+"&";
            $scope.loader = false;
            createPointsHtml(data.data.points);
            $( "#pointsList" ).append( pointsHtml );
        });
    };

    $scope.deleteTrip = function() {
        $('#confirm').modal('show').one('click', '#delete', function() {
            Api.send(URLS.deleteTrip, {trip_id: $routeParams.id}, function (data, status){
                if(data.status) {
                    $location.path('/trips');
                } else {
                    $scope.success = '';
                    $scope.errors = data.errors.join(', ');
                }
            });
        });
    };

    $scope.resetTripForm = function() {
      angular.element('#msg').html('');
      $scope.trip = angular.copy($scope.tripDefaults);
    };

    $scope.updateTrip = function() {
        angular.element('#msg').html('');
        Api.send(URLS.updateTrip, {trip: $scope.trip}, function (data, status) {
            if(data.status){
                angular.element('#msg').html(data.success_msg);
            }else{
                angular.element('#msg').html(data.error_msg);
            }
        });
    }

    $scope.moveTrip = function() {
        angular.element('#msg').html('');
        console.log($scope.selectedPeriodId);
        Api.send(URLS.moveTrip, {trip_id: $scope.trip.id, period_id: $scope.selectedPeriodId}, function (data, status) {
            if(data.status){
               $location.path('/drivers/'+$scope.trip.user_id+'/currentPeriod');
            }else{
                angular.element('#msg').html(data.error_msg);
            }
        });
    };

    $scope.changeSelectedPeriod = function(selectedPeriodId){
        $scope.selectedPeriodId = selectedPeriodId;
    };

    $scope.init();
    $scope.$watch('trip', function(trip){
        trip.start_date = $filter('utcdatetime')(trip.start_date);
        trip.end_date = $filter('utcdatetime')(trip.end_date);
    });
    $scope.$parent.openCalendar('start_date');
    $scope.$parent.openCalendar('end_date');
});