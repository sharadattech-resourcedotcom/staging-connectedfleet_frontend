ngApp.controller("DamagesCollectionModalController", function($scope, $routeParams, $uibModalInstance, collection) {   
	$scope.collection = collection;
	$scope.imgsrc = URLS.damage_item_src;
	
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});