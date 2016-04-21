ngApp.controller("StaffReportingController", function($scope, $location, $timeout, Api, $controller, $http) {	
	angular.extend(this, $controller('BaseController', {$scope: $scope}));
    $scope.success = '';
    $scope.errors = '';
    $scope.available_users = [];
    $scope.staff_users = [];
    $scope.email = {};

    $scope.removeFromStaff = function (user){
        $scope.staff_users = _.without($scope.staff_users, _.findWhere($scope.staff_users, {id: user.id}));
        $scope.available_users.push(user);
    };

    $scope.addToStaff = function (user){
        $scope.available_users = _.without($scope.available_users, _.findWhere($scope.available_users, {id: user.id}));
        $scope.staff_users.push(user);
    };

    $scope.fetchUsers = function (){
        Api.fetch(URLS.fetchSalesStaff, function (data, status){
            $scope.staff_users = data.data.staff_users;
            $scope.available_users = data.data.available_users;
            $scope.email = data.data.email;
        });
    };

    $scope.saveStaffUsers = function (){
        Api.send(URLS.sendSalesStaff, {staff_users: $scope.staff_users}, function (data, status){
            if(data.status)
            {
                $scope.email.email_type = "Sales Staff";
                $scope.email.subject = "Sales staff report -";
                $scope.email.content = "from method";
                Api.send(URLS.sendSettingsValues, {email: $scope.email}, function (data, status) { 
                    if(data.status){
                        $scope.success = 'Sales staff successfully saved.';
                        $scope.errors = '';
                    } else {
                        $scope.success = '';
                        $scope.errors = data.errors.join(', ');
                    }  
                });
            }
            else
            {
                $scope.errors = data.errors.join(', ');
            }
        });
    };

    $scope.fetchUsers();
    
    $('.nav-tabs li').removeClass('active');
    $('.nav-tabs li.settings').addClass('active');
});
