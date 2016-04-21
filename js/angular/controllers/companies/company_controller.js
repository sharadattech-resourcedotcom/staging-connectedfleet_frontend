ngApp.controller('CompanyController', function($scope, $rootScope, $location, $controller, $location, Api, Auth, SessionUser, $routeParams){
 //TODO: OTHER CONTROLLERS SHOULD LOOK LIKE THIS ONE!! REFACTOR REST!!
    $scope.company = {};
    $scope.companyHeads = [];
    $scope.companyHead = {};
    $scope.newCompanyHead = {};
    $scope.newCompanyHead.role_description = "Company Head"
    $scope.newpassword = {};
    $scope.success = '';
    $scope.errors = '';
    $scope.pass_success = '';
    $scope.pass_errors = '';
    $scope.can_update = Auth.authorize(true, ['edit companies']);

    $scope.changeLocation = function(segment){
    	$location.path('companies/'+$routeParams.id+'/'+segment);
        $scope.success = '';
        $scope.errors = '';
        $scope.pass_success = '';
        $scope.pass_errors = '';
    };

    $scope.init = function(){
        //getting company
        Api.send(URLS.companyDetails, {id: $routeParams.id}, function (data, status) {
            console.log(data);
            $scope.company=data.data.company;
            Api.send(URLS.companyHeads, {company: $scope.company}, function (data, status) {
                $scope.companyHeads=data.data.users;
                if($scope.companyHeads.length > 0){
                    angular.element('.heads-list').show();
                }else
                {
                    angular.element('.heads-list').hide();
                }
            });
        })
    };

    $scope.updateCompanyDetails = function (){
        Api.send(URLS.updateCompanyDetails, { company: $scope.company}, function (data, status) {
            if(data.status) {
                $scope.errors = '';
                $scope.success = 'Company successfully updated.'
            }else {
                $scope.errors = data.errors.join(', ');
                $scope.success = '';
            }
        });
    };

    $scope.listCompanyHeads = function (){
        Api.send(URLS.companyHeads, { company: $scope.company}, function (data, status) {
            $scope.companyHeads=data.data.users;
        });
    };
    
    $scope.createNewCompanyHead = function() {
        Api.send(URLS.createCompanyHead, { companyHead: $scope.newCompanyHead, company: $scope.company}, function (data, status) {
            if(data.status) {
                $scope.errors = '';
                $scope.success = 'Company manager successfully created.'
                $scope.newCompanyHead = {};
                $scope.newCompanyHead.role_description = "Company Head"
                $scope.listCompanyHeads();
                document.getElementById('addCompanyHeadForm').reset();
            }else {
                $scope.errors = data.errors.join(', ');
                $scope.success = '';
            }
        });
    };

    $scope.getCompanyHead = function(id) {
        Api.send(URLS.companyHead, { id: id}, function (data, status) {
            $scope.companyHead=data.data.user;
            angular.element('#headDetails').show();
            angular.element('#headsList').hide();
        });
    };

    $scope.saveCompanyHead = function(){
        Api.send(URLS.updateCompanyHead, { companyHead: $scope.companyHead}, function (data, status) {
            if(data.status) {
                $scope.errors = '';
                $scope.success = 'User details successfully saved.'
            }else {
                $scope.errors = data.errors.join(', ');
                $scope.success = '';
            }
        });
    };
    
    $scope.changeCompanyHeadPassword = function(){
        Api.send(URLS.changeCompanyHeadPassword, {companyHead: $scope.companyHead, newpassword: $scope.newpassword}, function (data, status) {
            if(data.status) {
                $scope.pass_errors = '';
                $scope.pass_success = 'Password successfully changed.'
            }else {
                $scope.pass_errors = data.errors.join(', ');
                $scope.pass_success = '';
            }
            $scope.newpassword = {};
            document.getElementById('changePasswordForm').reset();
        });
    };

    $scope.redirectToHeadDetails = function(id) {
        $location.path($location.path() + '/' + id.toString());
        $scope.getCompanyHead(id);
    };

    $scope.init();
});