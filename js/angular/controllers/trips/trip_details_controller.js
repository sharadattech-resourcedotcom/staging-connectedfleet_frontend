ngApp.controller("TripDetailsController",function($scope, $routeParams, $location, Api, Auth, $timeout, $filter, SessionUser) {
    $scope.colors = ['#97bbcd','#dcdcdc','#949fb1','#68F000'];
    $scope.fractions = [3, 5, 10, 15, 30, 60];    
    $scope.chartOpts = {fraction: 3, fuel: true, speed: true, rpm: true};    
    $scope.chart = null;     
    //URLS.donglePoints = URLS.donglePoints.replace('-1', $routeParams.tripID);
    //$scope.dongleData = [];
    var map_height = $('.cont').height();
    // $scope.getDongle = function() {
    //    Api.fetch(URLS.donglePoints+$routeParams.id, function (data, status) {
    //         $scope.dongleData = data;
    //         console.log(data);
    //     });
    // };
    $scope.loader = false;
    $scope.mapInitialized = false;
    $scope.can_update = Auth.authorize(true, ['update trips details']);
    $scope.can_change_status = Auth.authorize(true, ['change trips status']);
    $scope.activeTab = '';
    $scope.activeRightTab = 'edit';
    $scope.trackingEnabled = false;
    $scope.statuses = ['active','paused','finished'];
    $scope.trip = {};
    $scope.tripDefaults = {};
    var points = [];
    var newpoints = [];
    var pointsHtml = "";
    var marker = null;
    var markerIcon = new google.maps.MarkerImage(
        "images/icons/marker0.png",
        new google.maps.Size(12, 12),
        new google.maps.Point(0,0),
        new google.maps.Point(16, 16)
    );
    $scope.heatmapPoints = new google.maps.MVCArray();
    $scope.selectedPeriodId = null;

    $scope.$on('$destroy', function(){
        $timeout.cancel($scope.pull);
    });

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

    setMarker = function(lat,lng) {
        if (marker) {
            marker.setMap(null);
        }
        if ($scope.activeTab != 'map') {
            $scope.$apply(function(){
               $scope.activeTab = 'map';
                $scope.googleMapsInit();
            });
            
        }
        marker = new google.maps.Marker({
            map: $scope.map,
            anchorPoint: new google.maps.Point(lat, lng),
            draggable: false,
            // animation: google.maps.Animation.DROP,
        });
        marker.setIcon();
        marker.setPosition(new google.maps.LatLng(lat, lng));
        marker.setVisible(true);
        // $scope.map.setCenter({lat: lat, lng: lng});
    };

    $scope.googleMapsInit = function() {
        //Marker icons
        $scope.loader = true;
        var start_image = "images/icons/start_trip_pin.png";
        var end_image = "images/icons/finish_pin_icon.png";
        var current_location_image = "images/icons/current_location.png";
        var icon = new google.maps.MarkerImage(
                current_location_image, //url
                new google.maps.Size(33, 32), //size
                new google.maps.Point(0,0), //origin
                new google.maps.Point(16, 16) //anchor
        );

        // setting map options
        var mapProp = {
            center: new google.maps.LatLng($scope.tripDefaults.start_lat,$scope.tripDefaults.start_lon),
            zoom:8,
            mapTypeId:google.maps.MapTypeId.ROADMAP
        };
        //creating map
        //if($scope.activeTab=='map')
            $scope.map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
         // $scope.map = new google.maps.Map(document.getElementById("googleSpeedMap"),mapProp);
        //adding markers to map
        var start_marker = new google.maps.Marker({
            position: new google.maps.LatLng($scope.tripDefaults.start_lat,$scope.tripDefaults.start_lon),
            map: $scope.map,
            title: 'Starting point',
            icon: start_image
        });

        if($scope.tripDefaults.status == 'finished') {
            var end_marker = new google.maps.Marker({
                position: new google.maps.LatLng($scope.tripDefaults.end_lat, $scope.tripDefaults.end_lon),
                map: $scope.map,
                title: 'End point',
                icon: end_image
            });
        }
        //fit bounds of the map to the markers
        var bounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng($scope.tripDefaults.start_lat,$scope.tripDefaults.start_lon));
        if($scope.tripDefaults.status == 'finished') {
            bounds.extend(new google.maps.LatLng($scope.tripDefaults.end_lat, $scope.tripDefaults.end_lon));
            $scope.map.fitBounds(bounds);
        }else {
            if (points.length > 0)
            {
                bounds.extend(new google.maps.LatLng(points[points.length-1].latitude, points[points.length-1].longitude));
                $scope.map.fitBounds(bounds);
            }
        }


        //adding marker indicating current location of driver, if trip is not ended
        $scope.current_location_marker = new google.maps.Marker({
            map: $scope.map,
            title: 'Current location',
            icon: icon
        });

        //drawing polylines for trip
        angular.forEach(points, function(point, key) {
            //if($scope.activeTab == 'map')
                if (point.on_pause) {
                    //draw polyline as blue - paused trip
                    var color = "green";
                    var weight = 2;
                } else
                {
                    //draw polyline as red - points taken durning trip
                    var color = "blue";
                    var weight = 2;
                    //pushing points to heatmap, only those which are not taken on paused trip
                    $scope.heatmapPoints.push(new google.maps.LatLng(point.latitude, point.longitude));
                }
            // else
            // {       
            //          var weight = 2;
            //         if(point.vehicle_speed > $scope.redValue)
            //         {
            //             var color = "red";
            //             weight = 5;
            //         }
            //         else if(point.vehicle_speed > $scope.orangeValue)
            //         {
            //             var color = "orange";
            //             weight = 3;
            //         }
            //         else
            //         {
            //             var color = "green";
            //         }
                    
            //         //pushing points to heatmap, only those which are not taken on paused trip
            //         $scope.heatmapPoints.push(new google.maps.LatLng(point.latitude, point.longitude));
            // }
            if(key + 1 <= points.length - 1 ) {
                //drawing polyline
                var polyline = new google.maps.Polyline({
                    path: [new google.maps.LatLng(point.latitude, point.longitude), new google.maps.LatLng(points[key + 1].latitude, points[key + 1].longitude) ],
                    strokeColor: color,
                    strokeOpacity: 1.0,
                    strokeWeight: weight,
                    clickable: false,
                    map: $scope.map
                });

               if(key + 1 == points.length - 1 && $scope.tripDefaults.status != 'finished' )
               {
                   //setting current location of driver
                   $scope.current_location_marker.setPosition( new google.maps.LatLng(points[key + 1].latitude, points[key + 1].longitude));
               }
            }
        });

        //create heatmap layer
        $scope.heatmap = new google.maps.visualization.HeatmapLayer({
            data: $scope.heatmapPoints,
            "radius": 9,
            "maxOpacity": 1,
            // scales the radius based on map zoom
            "scaleRadius": false
            // if set to false the heatmap uses the global maximum for colorization
            // if activated: uses the data maximum within the current map boundaries
            //   (there will always be a red spot with useLocalExtremas true)
            //"useLocalExtrema": true
        });
        //creating control button for heatmap
        $scope.map.controls[google.maps.ControlPosition.TOP_CENTER].push($scope.heatmapControlButton());
        //creating control button for tracking
        if($scope.tripDefaults.status != 'finished' ) {
            $scope.map.controls[google.maps.ControlPosition.TOP_CENTER].push($scope.trackControlButton());
        }
        $scope.mapInitialized = true;
        $scope.loader = false;
    };

    $scope.googleMapsRefresh = function() {  
        $scope.readColorValues();
        var key = (points.length>0)?points.length - 1:0;

        while (key + 1 <= newpoints.length - 1) {
            if( $scope.activeTab == 'map')
            {
                var weight = 2;
                if (newpoints[key].on_pause) {
                    //draw polyline as blue - paused trip
                    var color = "green";
                } else {
                    //draw polyline as red - points taken durning trip
                    var color = "blue";
                    //pushing points to heatmap, only those which are not taken on paused trip
                }
            }
            else
            {
                    var weight = 2;
                    if(newpoints[key].vehicle_speed > $scope.redValue)
                    {
                        var color = "red";
                        weight = 5;
                    }
                    else if(newpoints[key].vehicle_speed > $scope.orangeValue)
                    {
                        var color = "orange";
                        weight = 3;
                    }
                    else
                    {
                        var color = "green";
                    }
            }
            if(!newpoints[key+1].on_pause){
                $scope.heatmapPoints.push(new google.maps.LatLng(newpoints[key+1].latitude, newpoints[key+1].longitude));
            }
            var polyline = new google.maps.Polyline({
                path: [new google.maps.LatLng(newpoints[key].latitude, newpoints[key].longitude),
                    new google.maps.LatLng(newpoints[key+1].latitude, newpoints[key+1].longitude) ],
                strokeColor: color,
                strokeOpacity: 1.0,
                strokeWeight: weight,
                clickable: false,
                map: $scope.map
            });
            key++;
        }

        $scope.current_location_marker.setPosition(new google.maps.LatLng(newpoints[key].latitude, newpoints[key].longitude));
        if($scope.trackingEnabled) {
            $scope.map.setCenter(new google.maps.LatLng(newpoints[key].latitude, newpoints[key].longitude));
        }
        points = newpoints;
        newpoints = [];
    };

    $scope.getChartData = function() {
       Api.send(URLS.charts + $routeParams.id, $scope.chartOpts, function (data, status) {
            $scope.chart = data.chart;
        });
    };

    $scope.init = function() {
        //resizing google map
        $scope.loader = true;
        $('#googleMap').css("height",map_height);
        $('#googleSpeedMap').css("height",map_height);
        Api.send(URLS.tripDetails, {id: $routeParams.id}, function (data, status) {
            $scope.trip = data.data.trip;
            //points = data.data.points;
            $scope.redValue = data.data.lines.red_value * 1.609;
            $scope.orangeValue = data.data.lines.orange_value * 1.609;
            $scope.stats = data.data.stats;
            $scope.lastPeriods = data.data.last_five_periods;
            $scope.trip.time = dateDiff($scope.trip.start_date, $scope.trip.end_date);
            $scope.tripDefaults = angular.copy($scope.trip);
            
            if($scope.tripDefaults.status != 'finished') {
                $scope.pull = $timeout($scope.refresh, 30000);
            }
            $scope.loader = false;
        });
    };

    $scope.checkPoints = function () {
        if(!points.length)
        {  
            if(!$scope.mapInitialized && $scope.activeTab=='map'){ 
                $scope.getTripPoints(true);
            }else{
                $scope.getTripPoints(false);
            }
        }
        else
        {
            if(!$scope.mapInitialized && $scope.activeTab=='map')
                { $scope.googleMapsInit();};
        }
    };

    $scope.getTripPoints = function (load_map) {
        $scope.loader = true;
         Api.send(URLS.tripPoints, {id: $routeParams.id }, function (data) {
            points = data.data.points;
            $scope.download_path = BACKEND_HOST + "/trips/download_points_xls?trip_id="+$routeParams.id+"&token="+SessionUser.getItem("access_token")+"&";
            if(load_map)
            {
                $scope.googleMapsInit();
            }
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

    $scope.refresh = function () {
        Api.send(URLS.tripPoints, {id: $routeParams.tripID }, function (data) {
            newpoints = data.data.points;
            if(points.length < newpoints.length) { // refresh map only if there are new points
                $scope.googleMapsRefresh();
            }
        });
        // Api.send(URLS.tripDetails, {id: $routeParams.tripID }, function (data) {
        //     $scope.tripDefaults = data;
        //     //temporary
        //     $scope.tripDefaults.time = $scope.dateDiff($scope.tripDefaults.start_date, $scope.tripDefaults.end_date);
        //     //
        // });
        if($scope.tripDefaults.status != 'finished') {
            $scope.pull = $timeout($scope.refresh, 30000);
        }else
        {
            $scope.current_location_marker.setMap(null);
        }
    };

    $scope.heatmapControlButton = function () {
        var heatmapControlDiv = document.createElement('div');
        var heatmapButton = document.createElement('button');
        heatmapButton.type = 'button';
        heatmapButton.class = 'btn btn-default';
        heatmapButton.innerHTML= 'Heatmap';
        heatmapControlDiv.appendChild(heatmapButton);
        google.maps.event.addDomListener(heatmapButton, 'click', function() {
            if($scope.heatmap.getMap()) {
                $scope.heatmap.setMap(null);
                heatmapButton.style.color = '#000000';
            }else
            {
                $scope.heatmap.setMap($scope.map);
                heatmapButton.style.color = '#ff0000';
            }
        });
        return heatmapControlDiv;
    };

    $scope.trackControlButton = function () {
        var trackControlDiv = document.createElement('div');
        var trackButton = document.createElement('button');
        trackButton.type = 'button';
        trackButton.class = 'btn btn-default';
        trackButton.innerHTML= 'Track';
        trackControlDiv.appendChild(trackButton);
        google.maps.event.addDomListener(trackButton, 'click', function() {
            $scope.trackingEnabled = !$scope.trackingEnabled;
            trackButton.style.color = ($scope.trackingEnabled)? '#ff0000':'#000000';
        });
        return trackControlDiv;
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
    //formats nicely date
    $scope.$watch('trip', function(trip){
        trip.start_date = $filter('utcdatetime')(trip.start_date);
        trip.end_date = $filter('utcdatetime')(trip.end_date);
    });

    $scope.$parent.openCalendar('start_date');
    $scope.$parent.openCalendar('end_date');

    //resizing google map
    $(window).resize(function(){
        $('#googleMap').css("height",map_height);
        $('#googleSpeedMap').css("height",map_height);
        //google.maps.event.trigger($scope.map, 'resize');
        //$scope.map.setZoom($scope.map.getZoom());
    });

});