ngApp.controller("BaseController", function($scope, $location, $timeout, $location, $http, Auth, SessionUser) {
	$scope.currentPath = '';
	$scope.user_name = '';
	$scope.user_id = null;
	$scope.user_role = '';
	$scope.session = {
		isSignedIn: function() {
			return JSON.parse(localStorage.getItem("SESSION_USER")) != null;
		},
		signOut: function() {
			localStorage.setItem("SESSION_USER", null);
			localStorage.setItem("SESSION_TOKEN", null);
			$location.path('/sign-in');
		},
		user: function() {
			data = JSON.parse(localStorage.getItem("SESSION_USER"));

			if (data != null) {				
				return data.user;
			}

			return null;
		}
	};

	$scope.resolveDriversActive = function(){
		if(Auth.authorize(true, ['see me']) && $location.path().indexOf('/drivers/'+$scope.user_id+'/') > -1){
			return false;	
		}
		else if ($location.path().indexOf('/drivers/') > -1) { 
			return true;	
		}

		return false;
	};

 $scope.openCalendar = function(name) {
      // Przeniesc to do kontrolera a najlepiej do dyrektywy!
      
          jQuery('input[name="'+ name + '"]').datepicker({format: "dd/mm/yyyy", autoclose: true});
    };

	$scope.$on('$routeChangeSuccess', function(next, current) {
		$scope.currentPath = current.$$route.originalPath;
		$scope.user_id = SessionUser.getItem('id');
		$scope.user_role = SessionUser.getItem('roleDescription');
		$scope.user_name = SessionUser.getItem('fullName');
		$scope.company_name = SessionUser.getItem('companyName');
	});

	$scope.isGemini = function() {
		return SessionUser.getItem('companyId') == 8;
	};
});