ngApp.controller("CreateUserController", function($scope, $location, $timeout, Api, $controller, $http) {	
	angular.extend(this, $controller('BaseController', {$scope: $scope}));

    $scope.user = {permissions: []};
    $scope.user.on_trip = false;
    $scope.success = '';
    $scope.errors = '';
    $scope.branches = [];
    
	$scope.fetchRoles = function(){
        Api.fetch(URLS.fetchCreateUserData, function (data, status) {              
            $scope.roles = data.data.roles;
            $scope.branches = data.data.branches;

            angular.forEach($scope.roles, function (role, index) {
             role.isChecked = true;
            });
        });
    }; 

    $scope.changeUserPermission = function(permission){
        if(permission.isChecked)
        {
            $scope.user.permissions.push(permission);
        }
        else
        { 
            $scope.user.permissions = _.without($scope.user.permissions, permission)
        }    
    };  

    $scope.changeRole = function(){
    	$scope.user.permissions = [];
	    angular.forEach($scope.user.role.permissions, function(p, index){
	            p.isChecked = true;
	            $scope.user.permissions.push(p);
	    });
    };

    $scope.sendUser = function(user){
    	user.role_id = user.role.id ;
		Api.send(URLS.sendUser, {user: user}, function (data, status) {
            if(data.status)
            {
                $scope.success = 'User has been successfully created.';
                $scope.errors = '';
            }
            else
            {
                $scope.success = '';
                $scope.errors = data.errors.join(', ');
            }
            $("html, body").animate({ scrollTop: 0 }, "fast");
		});
    };	

    $scope.fetchRoles();
    $('.nav-tabs li').removeClass('active');
    $('.nav-tabs li.create_user').addClass('active');
});