ngApp.controller("SettingsController", function($scope, $location, $timeout, Api, $controller, $http) {	
	angular.extend(this, $controller('BaseController', {$scope: $scope}));

    $scope.lines_values = {};
    $scope.success = '';
    $scope.errors = '';
    $scope.email_types = [];
    $scope.email = {};
    $scope.new_opt = {branch: '', product: '', insurance: ''};

    $scope.updateLinesValues = function() {
        Api.send(URLS.sendSettingsValues, {lines_values: $scope.lines_values}, function (data, status) { 
            if(data.status){
                $scope.success = '';
                $scope.errors = '';
                $scope.readSettings();

            } else {
                $scope.success = '';
                $scope.errors = data.errors.join(', ');
                $("html, body").animate({ scrollTop: 0 }, "fast");
            }                 
        });
    };

    $scope.addBranch = function() {
        Api.send(URLS.sendSettingsValues, {branch: $scope.new_opt.branch}, function (data, status) { 
            if(data.status){
                $scope.success = '';
                $scope.errors = '';
                $scope.readSettings();
            } else {
                $scope.success = '';
                $scope.errors = data.errors.join(', ');
                $("html, body").animate({ scrollTop: 0 }, "fast");
            }                 
        });
    };

    $scope.addProduct = function() {
        Api.send(URLS.sendSettingsValues, {product: $scope.new_opt.product}, function (data, status) { 
            if(data.status){
                $scope.success = '';
                $scope.errors = '';
                $scope.readSettings();
            } else {
                $scope.success = '';
                $scope.errors = data.errors.join(', ');
                $("html, body").animate({ scrollTop: 0 }, "fast");
            }  

        });
    };


    $scope.addInsuranceCompany = function() {
        Api.send(URLS.sendSettingsValues, {insurance_company: $scope.new_opt.insurance}, function (data, status) { 
            if(data.status){
                $scope.success = '';
                $scope.errors = '';
                $scope.readSettings();
            } else {
                $scope.success = '';
                $scope.errors = data.errors.join(', ');
                $("html, body").animate({ scrollTop: 0 }, "fast");

            }                 
        });
    };

    $scope.selectEmail = function() {
        $scope.email.content = '';
        $scope.email.recipients = '';
        $scope.email.subject = '';
         angular.forEach($scope.email_templates, function(t){
                if(t.email_type == $scope.email.email_type){
                    $scope.email = angular.copy(t);
                    return 0;
                }
             });
    };

    $scope.saveEmailTemplate = function() {
        Api.send(URLS.sendSettingsValues, {email: $scope.email}, function (data, status) { 
            if(data.status){
                $scope.success = 'Template successfully saved.';
                $scope.errors = '';
                $scope.readSettings();
            } else {
                $scope.success = '';
                $scope.errors = data.errors.join(', ');
            }  
            $("html, body").animate({ scrollTop: 0 }, "fast");
               
        });
    };

    $scope.remove = function(table_name, element_id) {
        Api.send(URLS.removeSettingsValue, {table_name: table_name, element_id: element_id}, function (data, status) { 
            if(data.status){
                $scope.success = '';
                $scope.errors = '';
                $scope.readSettings();
            } else {
                $scope.success = '';
                $scope.errors = data.errors.join(', ');
                $("html, body").animate({ scrollTop: 0 }, "fast");
            }                 
        });
    };

    $scope.readSettings = function(){
    	Api.fetch(URLS.fetchSettingsData, function (data, status) {  
        	$scope.lines_values.redValue = parseInt(data.data.lines_values.red_line_value,10);
            $scope.lines_values.orangeValue = parseInt(data.data.lines_values.orange_line_value,10);
            
            $scope.lines_values.rpm_limit = data.data.lines_values.rpm_limit;
            $scope.lines_values.rpm_points = data.data.lines_values.rpm_points;
            $scope.lines_values.fuel_limit = data.data.lines_values.fuel_limit;
            $scope.lines_values.fuel_points = data.data.lines_values.fuel_points;

            $scope.branches = data.data.branches;
            $scope.products = data.data.products;
            $scope.insurance_companies = data.data.insurance_companies;   

            $scope.email_templates = data.data.email_templates;    
            $scope.email_types = data.data.email_types;
            $scope.email_variables = data.data.email_variables;
        });
    }

    $scope.enableTab = function(id) {
        var el = document.getElementById(id);
        el.onkeydown = function(e) {
            if (e.keyCode === 9) { 

                var val = this.value,
                    start = this.selectionStart,
                    end = this.selectionEnd;
                this.value = val.substring(0, start) + '\t' + val.substring(end);
                this.selectionStart = this.selectionEnd = start + 1;
                if(id == 'email_content'){
                    $scope.email.content = this.value;
                }
                return false;
            }
        };
    }

    $scope.readSettings();
    $('.nav-tabs li').removeClass('active');
    $('.nav-tabs li.settings').addClass('active');

    $scope.$watch('location.path()', function(url) {
        $scope.success = '';
        $scope.errors = '';
       $scope.$on('$viewContentLoaded', function(event) {
            if ($location.path().indexOf('email_templates') > -1) {
                $scope.enableTab('email_content');
            } 
        });
    });
});