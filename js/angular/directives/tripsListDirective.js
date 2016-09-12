ngApp.directive('tripsList', function(SessionUser, Api){
	return {
		restrict: 'E',
		scope: {
			mode: '=',
			itemId: '='
		},
		templateUrl: '/templates/directives/tripsListDirectiveTpl.html',
		link: function (scope, elem, attrs) {
			scope.trips = [];
		    scope.currentPage = 1;
		    scope.pageSize = 50;
		    scope.totalTrips = 0;
		    console.log(scope.mode, scope.itemId)
		    scope.vehicleTrips = function(page, callback) {
		        Api.send(URLS.fetchVehicleTrips, {vehicle_id: scope.itemId, page: page}, function (data) {
		        	callback(data);
		        });
		    };

		 	scope.fetchTripsPage = function(page) {
		 		var properFunc = null;
		 		switch(scope.mode) {
		 			case 'vehicle':
		 				properFunc = scope.vehicleTrips;
		 				break;
		 			default:
		 				properFunc = null;
		 		};

		 		properFunc(page, function(data){
		 			if (data.status) {
		 				scope.currentPage = page;
		 				if(data.data.count != null){
			                scope.totalTrips = data.data.count;
			            };
			            scope.trips = data.data.trips;
		 			} else {
		 				alert(data.errors);
		 			}
		 		});

		 		if(scope.trips.length) {
	                angular.element('.trips-list').show();
	            } else {
	                angular.element('.trips-list').hide();
	            }
	            $("#wrapper").animate({scrollTop: 0}, 600);
		 	};

		 	scope.fetchTripsPage(0, scope.itemId, scope.mode);
		}
	};
});