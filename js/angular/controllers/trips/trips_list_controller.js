ngApp.controller("TripsController",function($scope, $location, $timeout, Api, $filter, $controller){
    angular.extend(this, $controller('BaseController', {$scope: $scope}));    
    
    $scope.trips = [];
    $scope.filter = '';
    $scope.currentPage = 1;
    $scope.pageSize = 50;

    $scope.list = function(page) {
        $scope.currentPage = page;
        Api.send(URLS.fetchTripsList, {filter: $scope.filter, page: $scope.currentPage}, function (data) {
            $scope.trips = data.data.trips;
            if(data.data.count != null){
                $scope.totalTrips = data.data.count;
            }

            if($scope.trips.length) {
                angular.element('.trips-list').show();
            }else
            {
                angular.element('.trips-list').hide();
            }
            $("#wrapper").animate({scrollTop: 0}, 600);
        });
    };
    $scope.list(0);
    // $scope.$watch('filter', function(newVal) {
    //     $scope.list();
    // });

    $scope.redirectToTripDetails = function(id) {
        $location.path('/trips/'+id.toString());
    };

})