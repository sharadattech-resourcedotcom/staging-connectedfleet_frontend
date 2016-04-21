ngApp.factory('Auth', function () {  
 var authorize = function (loginRequired, requiredPermissions) {
    var result = -1,
        user = JSON.parse(localStorage.getItem('SESSION_USER')),
        loweredPermissions = [],
        hasPermission = true,
        permission, i;
        if (user == null && loginRequired == false)
        {
            return 1;
        }
    if (loginRequired === true && (user === undefined || user == null)) {
        result = -1;//jcs.modules.auth.enums.authorised.loginRequired;
    } else if ((loginRequired === true && user !== undefined) &&
        (requiredPermissions === undefined || requiredPermissions.length === 0)) {
        // Login is required but no specific permissions are specified.
        result = 1;
    } else if (requiredPermissions) {
        loweredPermissions = [];
        angular.forEach(user.permissions, function (permission) {
            loweredPermissions.push(permission.description.toLowerCase());
        });

        for (i = 0; i < requiredPermissions.length; i += 1) {
            permission = requiredPermissions[i].toLowerCase();
            if(permission.indexOf('scheduler') > -1 || permission.indexOf('appointment') > -1 || permission.indexOf('inspection') > -1){
                if(!user.company_info.enabled_inspections){
                    return 0;
                }
            }
            if(permission.indexOf('drivers types') > -1 ){
                if(!user.company_info.enabled_hours_payroll){
                    return 0;
                }
            }
            hasPermission = loweredPermissions.indexOf(permission) > -1 ? 1 : 0;
            if (hasPermission) {
                break;
            }
        }
        result = hasPermission;
    }
    return result;
};
    return {
     authorize: authorize
    };
});