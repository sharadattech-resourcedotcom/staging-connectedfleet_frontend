ngApp.factory('Api', function($http, SessionUser) {
    var extendedHttp = angular.extend($http, {});

    extendedHttp.STATUS_OK = 200;

    extendedHttp.send = function(url, obj, callback){
        var headers = {};
        
        headers['Content-Type'] = "application/json";
        headers['Accept'] = "*/*";

        if (localStorage.getItem("SESSION_TOKEN") != null && localStorage.getItem("SESSION_TOKEN") != 'null') {
            
            headers['X-Access-Token'] = JSON.parse(localStorage.getItem("SESSION_TOKEN")).access_token;
        }

        function handleResponse(data, status, headers, config) {
            if (status == 402) {
                alert("You're not authorized to access that resource");
            } else if (status == 400 || status == 200) {
                // Form errors or call passed
                if(data.errors){
                    if(!data.status && data.errors[0] == "Authentication failed")
                    {
                        SessionUser.signout();
                    }
                }
                callback(data, status);
            } else if (status == 401) {

            } else {
                // Other error. Display alert saying sorry.
                // alert('['+ status + '] Sorry but server error occured during processing your request');
                callback({error: 'Sorry but server error occured during processing your request'}, status);
            }
        };

        this.post(url, obj, {headers: headers}).success(handleResponse).error(handleResponse);
    };

    extendedHttp.fetch = function(url, callback){
        var headers = {};
        
        headers['Content-Type'] = "application/json";
        headers['Accept'] = "*/*";
        
        if (localStorage.getItem("SESSION_TOKEN") != null && localStorage.getItem("SESSION_TOKEN") != 'null') {
            headers['X-Access-Token'] = JSON.parse(localStorage.getItem("SESSION_TOKEN")).access_token;
        }

        function handleResponse(data, status, headers, config) {
            if (status == 402) {
                alert("You're not authorized to access that resource");
            } else if (status == 200) {
                 if(data.errors){
                    if(!data.status && data.errors[0] == "Authentication failed")
                    {
                        SessionUser.signout();
                    }
                }
                callback(data, status);
            } else if (status == 401) {

            } else if (status != 0) {
                alert('['+ status + '] Sorry but server error occured during processing your request');
            }
        };

        this.get(url, {headers: headers}).success(handleResponse).error(handleResponse);
    };

    extendedHttp.update = function(url, obj, callback){
        var headers = {};
        
        headers['Content-Type'] = "application/json";
        headers['Accept'] = "*/*";
        
        if (localStorage.getItem("SESSION_TOKEN") != null && localStorage.getItem("SESSION_TOKEN") != 'null') {
            headers['X-Access-Token'] = JSON.parse(localStorage.getItem("SESSION_TOKEN")).access_token;
        }

        function handleResponse(data, status, headers, config) {
            if (status == 402) {
                alert("You're not authorized to access that resource");
            } else if (status == 200) {
                if(data.errors){
                    if(!data.status && data.errors[0] == "Authentication failed")
                    {
                        SessionUser.signout();
                    }
                }
                callback(data, status);
            } else if (status == 401) {

            } else if (status != 0) {
                alert('['+ status + '] Sorry but server error occured during processing your request');
            }
        };
        this.put(url, obj, {headers: headers}).success(handleResponse).error(handleResponse);
    };

    extendedHttp.remove = function(url, callback){
        var headers = {};
        
        headers['Content-Type'] = "application/json";
        headers['Accept'] = "*/*";
        
        if (localStorage.getItem("SESSION_TOKEN") != null && localStorage.getItem("SESSION_TOKEN") != 'null') {
            headers['X-Access-Token'] = JSON.parse(localStorage.getItem("SESSION_TOKEN")).access_token;
        }

        function handleResponse(data, status, headers, config) {
            if (status == 402) {
                alert("You're not authorized to access that resource");
            } else if (status == 200) {
                if(data.errors){
                    if(!data.status && data.errors[0] == "Authentication failed")
                    {
                        SessionUser.signout();
                    }
                }
                callback(data, status);
            } else if (status == 401) {

            } else if (status != 0) {
                alert('['+ status + '] Sorry but server error occured during processing your request');
            }
        };

        this.delete(url, {headers: headers}).success(handleResponse).error(handleResponse);
    };

    extendedHttp.handleErrors = function(form, data) {
        $.each($('.'+ form).find('label.error'), function(){
            var forAttr = $(this).attr('for').split('-');
        });

        for (var i in data.errors) {
        }
    };
    return extendedHttp;
});