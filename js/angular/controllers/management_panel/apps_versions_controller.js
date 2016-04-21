ngApp.controller("AppsVersionsController", function($scope, $location, $timeout, Api, $controller, FileUploader, SessionUser) {	
	angular.extend(this, $controller('BaseController', {$scope: $scope}));
    $scope.success = '';
    $scope.errors = '';
    $scope.isUploading = false;
    $scope.app_version = {};
    $scope.app_version.internal_group = false;
    
    $scope.uploader = new FileUploader({
            headers: { "X-Access-Token": SessionUser.getItem('access_token') },
            url: URLS.uploadPath,
            autoUpload: false
        });

    $scope.uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        $scope.isUploading = false;
        $scope.fileToImport = null;

        if (response.status) {
            $scope.success = 'File uploaded successfully';
            $scope.errors = "";
        } else {
            $scope.success = "";
            $scope.errors = response.errors.join(', ');
        }
    };

    $scope.uploadFiles = function() {
        angular.forEach($scope.uploader.queue, function(item, key) {
           item.formData.push($scope.app_version);
       });
        $scope.isUploading = true;
        $scope.uploader.uploadAll();
    };

    Api.send(URLS.companiesList, {}, function (data, status) {
        $scope.companiesList = data.data.companies;
        $scope.app_version.company_id = data.data.companies[0].id;
    });

    
    $('.nav-tabs li').removeClass('active');
    $('.nav-tabs li.apps_versions').addClass('active');
});
