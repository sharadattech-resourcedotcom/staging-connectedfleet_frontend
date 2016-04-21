ngApp.factory('SessionUser', function ($location) {  
 
    var signin = function(user, token, app) {
        localStorage.setItem("SESSION_USER", JSON.stringify(user));
        localStorage.setItem("SESSION_TOKEN", JSON.stringify(token));
        localStorage.setItem("APP", JSON.stringify(app))
        window.location.href = '#/dashboard';
    };

    var signout = function(){
    	localStorage.setItem("SESSION_USER", null);
		localStorage.setItem("SESSION_TOKEN", null);
		$location.path('/');
    };

    var getItem = function(item) {
        if (localStorage.getItem('SESSION_USER') != null && localStorage.getItem('SESSION_USER') != "null")
        {
            var response = null;
            switch(item){
                case 'id':
                    response = JSON.parse(localStorage.getItem('SESSION_USER')).id;
                    break;
                case 'roleDescription':
                    response = JSON.parse(localStorage.getItem('SESSION_USER')).role_description;
                    break;
                case 'roleId': 
                    response = JSON.parse(localStorage.getItem('SESSION_USER')).role_id;
                    break;
                case 'access_token': 
                    response = JSON.parse(localStorage.getItem('SESSION_TOKEN')).access_token;
                    break;
                case 'fullName': 
                    response = JSON.parse(localStorage.getItem('SESSION_USER')).full_name;
                    break;
                case 'companyName': 
                    response = JSON.parse(localStorage.getItem('SESSION_USER')).company_info.name;
                    break;
                case 'companyId': 
                    response = JSON.parse(localStorage.getItem('SESSION_USER')).company_info.id;
                    break;
                case 'appLink':
                    app = JSON.parse(localStorage.getItem('APP'));
                    if (app) {
                        response = BACKEND_HOST + '/' + JSON.parse(localStorage.getItem('APP')).file_path; 
                    } else {
                        response = 'unknown';
                    }; 
                    break;
            }
            return response;
        }
        return null;
    };

    var isFromPhotoMe = function() {
        if (getItem("companyId") == 4) {
            return true;
        }
        return false;
    };

    return {
     signin: signin,
     signout: signout,
     getItem: getItem,
     isFromPhotoMe: isFromPhotoMe
    };
});