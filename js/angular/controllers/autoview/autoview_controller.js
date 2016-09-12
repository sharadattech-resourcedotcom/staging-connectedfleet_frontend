ngApp.controller("AutoViewController",function($scope, $http, Api, $location, $timeout, SessionUser){

	var listURL = BACKEND_HOST+"/autoview/drivers";
	var defaultIcon = new google.maps.MarkerImage(
        "images/icons/current_location_min.png",
        new google.maps.Size(12, 12),
        new google.maps.Point(0,0),
        new google.maps.Point(16, 16)
    );
	var icons = [];
	for (i = 0; i <= 7; i++) { 
	    icons[i] = new google.maps.MarkerImage(
			        "images/icons/marker" + String(i) + ".png",
			        new google.maps.Size(12, 12),
			        new google.maps.Point(0,0),
			        new google.maps.Point(16, 16)
			    );
	}
	
	$scope.searchQuery = '';
	$scope.markers = [];
	$scope.window_height = $(window).height() - $('.drivers-map').offset().top - 2;
	var mapProp = {
        center: new google.maps.LatLng(52.8088104, -1.6067256),
        zoom:7,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };
	$scope.map = new google.maps.Map(document.getElementById("googleMap"),mapProp);

	$scope.getDrivers = function() {
		Api.fetch(listURL, function (data, status) {
			$scope.drivers = data.data;
			$scope.refresh_markers_timeout = $timeout(function(){
				angular.forEach($scope.drivers, function(d){
					$scope.formatLastSyncTime(d);
					d.available = true;
					d.visible = true;
					$('.checkbox-'+ d.id).prop('checked', true);
				});
				$scope.refreshMarkers();
			}, 100);
		}); 
	};

	$scope.checkUncheckDriver = function() {
        angular.forEach($scope.drivers, function(d){
            d.available = $('.checkbox-'+ d.id).prop('checked');
        });
        $scope.refreshMarkers();
    };

	$scope.checkUncheckBoxes = function() {
		checked = $('.check-uncheck').prop('checked');

		angular.forEach($scope.drivers, function(d){
			$('.checkbox-'+ d.id).prop('checked', checked);
			d.available = checked;
		});

		$scope.refreshMarkers();
	};

	$scope.filterDrivers = function() {
		angular.forEach($scope.drivers, function(d){
			if ($scope.searchQuery == '') {
				d.visible = true;
			} else {
				d.visible = ((d.first_name + ' ' + d.last_name).toLowerCase().indexOf($scope.searchQuery) >= 0)
			}
		});		
		$scope.refreshMarkers();	
	};

	$scope.updateDrivers = function() {
		Api.fetch(listURL, function (data, status) {
			angular.forEach($scope.drivers, function(d){
				angular.forEach(data.data, function(dd){
					if (dd.id == d.id) {
						d.lat = dd.lat;
						d.lng = dd.lng;
						d.last_sync = dd.last_sync;
						d.status = dd.status
						$scope.formatLastSyncTime(d);
					}
				});
			});

			$scope.refreshMarkers();

			$scope.update_drivers_timeout = $timeout(function(){
				$scope.updateDrivers();
			}, 10000);
		});			
	};

	$scope.formatLastSyncTime = function(d) {
		var date = new Date();
    	var localOffset = (-1) * date.getTimezoneOffset();
		if (d.last_sync == -1) {
			d.last_sync_formatted = 'never';
		} else if (d.last_sync > 60) {
			d.last_sync_formatted = Math.round((d.last_sync+localOffset) / 60) + 'h';
		} else {
			d.last_sync_formatted = Math.round((d.last_sync+localOffset)) + 'm';
		}
	};

	$scope.refreshMarkers = function() {
		angular.forEach($scope.markers, function(m){
			m.setMap(null);
		});

		$scope.markers = [];
		var icon = defaultIcon;
		angular.forEach($scope.drivers, function(d){
			d.marker = null;
			if (SessionUser.isFromPhotoMe() || SessionUser.isFromEasidirve()) {
				icon = icons[d.marker_type];
			}

			if (d.available && d.visible) {
				d.marker = new google.maps.Marker({
					position: new google.maps.LatLng(d.lat, d.lng),
	                map: $scope.map,
	                title: 'Current location',
	                icon: icon
	            });
				status = d.status == null ? "":d.status;
	            d.marker.info = new google.maps.InfoWindow({
				  content: d.first_name + " " + d.last_name + "<br>" + status
				});
				google.maps.event.addListener(d.marker, 'click', function() {
				  d.marker.info.open($scope.map, d.marker);
				});

				$scope.markers.push(d.marker);
			}
		});
	};

	$scope.getDrivers();

	$('#googleMap').css("height",$scope.window_height);
    google.maps.event.trigger($scope.map, 'resize');

    $(window).resize(function(){
        $('#googleMap').css("height",$scope.window_height);
        google.maps.event.trigger($scope.map, 'resize');
    });
    
	$scope.update_drivers_timeout = $timeout(function(){
		$scope.updateDrivers();
	}, 5000);

	$scope.$on('$destroy', function(){
   		$timeout.cancel($scope.update_drivers_timeout);
   		$timeout.cancel($scope.refresh_markers_timeout);
	});
});