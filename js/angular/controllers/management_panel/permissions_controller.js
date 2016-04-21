ngApp.controller("PermissionsController",function($scope, $location, $timeout, Api, $filter, $controller){

    $scope.selectedRoles= [];
    $scope.success = '';
    $scope.errors = '';

    $scope.fetchData = function(){
        Api.fetch(URLS.fetchPermissionsData, function (data, status) {
            $scope.users_list = data.data.users;
            $scope.roles = data.data.roles;
            $scope.permissions = data.data.permissions;

            angular.forEach($scope.roles, function (role, index) {
                role.isChecked = true;
                $scope.changeUsersFilter(role);
            });
        });
    };

    $scope.changeUsersFilter = function(role){
        if(role.isChecked)
        {
            $scope.selectedRoles.push(role.description);
        }
        else
        {
            var index = $scope.selectedRoles.indexOf(role.description);
            if(index >= 0) {
               $scope.selectedRoles.splice(index,1); 
            }
            
        }
    };

    $scope.changeUser = function(){
        $scope.user.selected_role = _.findWhere($scope.roles, {id: $scope.user.role_id});
        if($scope.user.selected_role != undefined)
        {
            angular.forEach($scope.user.selected_role.permissions, function (permission, index) {
                if(_.findWhere($scope.user.permissions, {id: permission.id }) != undefined)
                {
                    permission.isChecked = true;
                }
                else
                {
                    permission.isChecked = false; 
                }
            });
        }
    };

    $scope.changeRole = function(){
        $scope.user.permissions = [];
        angular.forEach($scope.user.selected_role.permissions, function(p, index){
            p.isChecked = true;
            $scope.user.permissions.push(p);
        });   
    };

    $scope.changeUserPermission = function(permission){
        if(permission.isChecked)
        {
            $scope.user.permissions.push(permission);
        }
        else
        {
            $scope.user.permissions = _.without($scope.user.permissions, _.findWhere($scope.user.permissions, {id: permission.id}))
        }    
    };

    $scope.sendUserPermissions = function(user){
        Api.send(URLS.sendUserPermissions, {user: user}, function (data, status) {
            if(data.status)
            {
                $scope.success = 'User permissions has been successfully saved.';
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

    $scope.fetchData();
    $('.nav-tabs li').removeClass('active');
    $('.nav-tabs li.permissions').addClass('active');
});