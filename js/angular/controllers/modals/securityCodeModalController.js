ngApp.controller("SecurityCodeModalController", function($scope, $routeParams, $uibModalInstance) {   
    $scope.generatedSecurityCode = null;
    $scope.securityCodeSalt = 0;

    $scope.generateSecurityCode = function() {
        salt = moment().format('YYYY-MM-DD') + $routeParams.id + $scope.securityCodeSalt.toString();
        $scope.generatedSecurityCode = CryptoJS.SHA512(salt).toString().replace(/[a-zA-Z ]/g,'').substring(0, 4);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});