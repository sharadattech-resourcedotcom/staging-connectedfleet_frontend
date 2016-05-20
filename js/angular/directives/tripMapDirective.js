ngApp.directive('tripMap', function(SessionUser, Api){
	return {
		restrict: 'E',
		scope: {
			setFunctions: '&'
		},
		templateUrl: '/templates/directives/tripMapDirectiveTpl.html',
		link: function (scope, elem, attrs) {
			var coordPoints = [];
			var marker = null;
			var polyline = null;
			var map = null;
			var marker = null
			var start_marker = null;
			var end_marker = null;
			var start_image = "images/icons/start_trip_pin.png";
	        var end_image = "images/icons/finish_pin_icon.png";
	        var current_location_image = "images/icons/current_location.png";
		    var markerIcon = new google.maps.MarkerImage(
		        "images/icons/marker0.png",
		        new google.maps.Size(12, 12),
		        new google.maps.Point(0,0),
		        new google.maps.Point(16, 16)
		    );
			var getPoints = function(callback){
				Api.send(URLS.tripPoints, {id: scope.trip.id, onlyCoords: true }, function (data) {
		            coordPoints = data.data.points;
		            callback();
		        });
			};

			scope.setMarker = function(lat,lng) {
		        if (marker) {
		            marker.setMap(null);
		        }
		        marker = new google.maps.Marker({
		            map: map,
		            anchorPoint: new google.maps.Point(lat, lng),
		            draggable: false,
		            animation: google.maps.Animation.DROP,
		        });
		        marker.setIcon();
		        marker.setPosition(new google.maps.LatLng(lat, lng));
		        marker.setVisible(true);
		    };

		    var updateTripLines = function() {
		    	var polyline = new google.maps.Polyline({
                    path: coordPoints,
                    strokeColor: "blue",
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    clickable: false,
                    map: map
            	});
		    };

			scope.mapInit = function(trip) {
				scope.trip = trip;
				console.log(scope.trip);
				getPoints(function(){
					var mapProp = {
			            center: new google.maps.LatLng(scope.trip.start_lat, scope.trip.start_lon),
			            zoom:16,
			            mapTypeId:google.maps.MapTypeId.ROADMAP
			        };
					map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
					updateTripLines();
					start_marker = new google.maps.Marker({
			            position: new google.maps.LatLng(scope.trip.start_lat,scope.trip.start_lon),
			            map: map,
			            title: 'Starting point',
			            icon: start_image
			        });

			        if(scope.trip.status == 'finished') {
			        	if (scope.trip.end_lat == 0 || scope.trip.end_lat == null ||  scope.trip.end_lon == 0 || scope.trip.end_lon == null) {
			        		last = coordPoints[coordPoints.length - 1]
			        		scope.trip.end_lat = last.lat;
			        		scope.trip.end_lon = last.lng;
			        	};

			            end_marker = new google.maps.Marker({
			                position: new google.maps.LatLng(scope.trip.end_lat, scope.trip.end_lon),
			                map: map,
			                title: 'End point',
			                icon: end_image
			            });
			        }
					return;
				});
			};

			scope.setFunctions({mapInit: scope.mapInit, setMarker: scope.setMarker});
		}
	}
});