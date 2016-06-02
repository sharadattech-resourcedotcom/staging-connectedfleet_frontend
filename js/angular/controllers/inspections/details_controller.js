ngApp.controller('InspectionDetailsController', function($scope, $rootScope, $location, $controller, $location, Api, Auth, SessionUser, $routeParams){

	$scope.success = '';
	$scope.errors = '';
  $scope.imgsrc = URLS.damage_item_src;
  $scope.termsrc = URLS.terms_item_src;

	$scope.fetchDetails = function() {
	    Api.fetch(URLS.inspection_details.replace(':id', $routeParams.id), function (data, status) {
	    	$scope.inspection = data.data.inspection;
        $scope.driver = data.data.driver;
        $scope.download_path = BACKEND_HOST + "/inspections/download_" + SessionUser.companyAbbrev() + "_inspection_pdf?inspection_id="+$scope.inspection.id+"&token="+SessionUser.getItem("access_token")+"&";
        
	    });
    };

    $scope.getClass = function (path) {
      if ($location.path().indexOf(path) > -1) {
        return 'active';
      } else {
        return '';
      }
    }

    $scope.fetchDetails();
});