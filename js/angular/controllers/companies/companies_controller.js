ngApp.controller('CompaniesController', function($scope, $rootScope, $location, $controller, $location, Api, Auth, SessionUser, $routeParams){

    $scope.filter    = '';
    $scope.success = '';
    $scope.errors = '';
    $scope.companies =  [];
    $scope.newcompany = {};

    $scope.createNewCompany = function() {
        Api.send(URLS.companyCreate, {company: $scope.newcompany}, function (data, status) {
             if(data.status) {
                $scope.errors = '';
                $scope.success = 'Company successfully created.'
                $scope.newcompany = {};
                $scope.list();
                document.getElementById('addCompanyForm').reset();
            }else {
                $scope.errors = data.errors.join(', ');
                $scope.success = '';
            }
        });
    }

    $scope.list = function() {
        Api.send(URLS.companiesList, {'filter': $scope.filter}, function (data, status) {
                    $scope.companies = data.data.companies;
                });
    };

    $scope.$watch('filter', function(newVal) {
        $scope.list();
    });

    $scope.redirectToCompanyDetails = function(id) {
        $location.path('/companies/'+id.toString()+"/details");
    };
});