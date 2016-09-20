ngApp.filter('selectedRolesFilter', function() {
     return function(users, roles) {
        if(roles && users){
          return users.filter(function(user) {
               if (roles.indexOf(user.role_description) != -1) {
                 return true;
               }
               return false;
          });
        }
        return true;
    };
});    

ngApp.filter('utcdate', function() {
    return function(date) {
        if (date == null || date == '') return '';

        date = date.replace('.000Z').replace('T', ' ');
        return moment(date, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY');
    };
});

ngApp.filter('utcdatetime', function() {
    return function(date) {
        if (date == null || date == '') return '';
        var d = new Date();
        date = new Date(new Date(date).getTime() + d.getTimezoneOffset());
        return moment(date).format('DD/MM/YYYY HH:mm');
    };
});

ngApp.filter('datetime', function() {
    return function(date) {
        if (date == null || date == '') return '';
        var d = new Date();
        date = new Date(new Date(date).getTime());
        return moment.utc(date).format('DD/MM/YYYY HH:mm');
    };
});
