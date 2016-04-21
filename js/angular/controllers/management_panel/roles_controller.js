ngApp.controller("RolesController",function($scope, $location, $timeout, Api, $filter, $controller){    
     
    $scope.success = '';
    $scope.errors = '';  

    $scope.fetchData = function(){
        Api.fetch(URLS.fetchRolesData, function (data, status) {
            $scope.roles = data.data.roles;
            $scope.permissions = data.data.permissions;
            angular.forEach($scope.permissions, function (permission, index) {
                 permission.isChecked = false;
            });
            $scope.new_role_permissions = angular.copy($scope.permissions);
            $scope.role = $scope.roles[0];
            $scope.changeRole($scope.roles[0]);
        });
    };

    $scope.changeRole = function(role){
        $scope.role = role;
        angular.forEach($scope.permissions, function(p, index){
            p.isChecked = false;
        });

        angular.forEach($scope.role.permissions, function (permission, index) {
            angular.forEach($scope.permissions, function(p, index2){
                if(permission.id == p.id)
                {   
                    $scope.permissions[index2].isChecked = true;
                    return;
                }
            });
        });
    };

    $scope.changeRolePermission = function(permission, new_role){
         if(permission.isChecked)
         {  
            if(new_role)
            {
                $scope.new_role.permissions.push({id: permission.id, description: permission.description});
            }
            else
            {
                $scope.role.permissions.push({id: permission.id, description: permission.description});
            }                 
         }
         else
         {
            if(new_role)
            {
                angular.forEach($scope.new_role.permissions, function (p, index) {
                    if( permission.id == p.id)
                    {
                        $scope.new_role.permissions.splice(index,1);
                    }
                });
            }
            else
            {
                angular.forEach($scope.role.permissions, function (p, index) {
                    if( permission.id == p.id)
                    {
                        $scope.role.permissions.splice(index,1);
                    }
                });
            }         
         }
    };

    $scope.submitPermissions = function(){
        Api.send(URLS.sendRoles, {roles: $scope.roles}, function (data, status) {
            if(data.status)
            {
                $scope.success = 'Roles permissions has been successfully saved.';
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

    $scope.createRoleModal = function(){
        $scope.new_role = {description:'', permissions:[]};
        $('#myModal').modal('show');
    };

    $scope.sendNewRole = function(){
        Api.send(URLS.sendNewRole, {role: $scope.new_role}, function (data, status) {
            if(data.status)
            {
                $scope.fetchData();
                $('#myModal').modal('hide');
            }
            else
            {
                $scope.errors = data.errors.join(', ');
            }
        });
    };

    $scope.fetchData();
    $('.nav-tabs li').removeClass('active');
    $('.nav-tabs li.roles').addClass('active');
});
