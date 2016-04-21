ngApp.controller('ReportsController', function($scope, $location, $timeout, Api, SessionUser, $controller, $http) {	
	angular.extend(this, $controller('BaseController', {$scope: $scope}));

      $scope.report = {};
      $scope.columns = [];
      $scope.values = null;
      $scope.loader = false; 
      $scope.currentPage = 1;
      $scope.pageSize = 100;
      $scope.totalRecords = 0;
      $scope.page = [];
      $scope.sortingDirection = false;
      $scope.sortedBy = null;
      $scope.topTen = true;
      $scope.sortOptions = [{name: 'MPH'},{name:'MPG'},{name:'RPM'},{name:'BP'}]
      $scope.topOptions = [{name: 'Top ten', value: 3}, {name:'Bottom ten', value:2}, {name:'Run all', value:1}]
      $scope.presortBy = $scope.sortOptions[0].name;

      $scope.adjustColumns = function() {
        $('#reports').height(($(window).height() - 100));
      };

      $scope.change = function(name){
        if(name == 'approved')
        {
          if(!$scope.report.approved && !$scope.report.unapproved)
            $scope.report.unapproved=true;
        }
        else if(name == 'unapproved')
        {
            if(!$scope.report.unapproved)
            {
              $scope.report.opened = false;
              $scope.report.closed = true;
            }
            else
            {
              $scope.report.opened = true;
            }

           if(!$scope.report.approved && !$scope.report.unapproved)
            $scope.report.approved=true;
        }
        else if(name == 'opened')
        {
          if(!$scope.report.opened && !$scope.report.closed)
            $scope.report.closed=true;
        }
        else
        {
          if(!$scope.report.opened && !$scope.report.closed)
            $scope.report.opened=true;
        }
      };

      $scope.fetchReportsList = function() {
        Api.fetch(BACKEND_HOST+'/reports/list', function (data, status) { 
          $scope.reports_list = data;
          $scope.report.report_name = 'trips';
          $scope.report.approved=true;
          $scope.report.unapproved=true;
          $scope.report.opened=true;
          $scope.report.closed=true;
        });
      };

      $scope.report = {report_name: $scope.report.report_name, date_from: moment().format('DD/MM/YYYY'), date_to: moment().format('DD/MM/YYYY'), approved: $scope.report.approved, unapproved: $scope.report.unapproved, opened: $scope.report.opened, closed: $scope.report.closed, sort: $scope.presortBy, top: $scope.topTen};
      $scope.generateReport = function() {
        
        $scope.report.top = $scope.topTen;
        $scope.report.sort = $scope.presortBy;

        $scope.loader = true;
        $scope.values = null;
        $scope.columns = [];
        Api.send(BACKEND_HOST+'/reports/generate', $scope.report, function ( data) {           
            $scope.columns = data.data.columns;
            $scope.values = data.data.values;
            if(data.data.count != null){
                $scope.totalRecords = data.data.count;
            }
            if($scope.report.report_name == 'periods'){
              $scope.users = data.data.users;
            }
            $scope.changePage(1);
            $location.path('/reports/generate');
            $scope.download_path = BACKEND_HOST + "/reports/download_report_xls?report_name="+$scope.report.report_name+"&date_from="+$scope.report.date_from+
            					"&date_to="+$scope.report.date_to+"&approved="+$scope.report.approved+"&unapproved="+$scope.report.unapproved+"&token="+SessionUser.getItem("access_token")+"&";
            $scope.loader = false;
        });   
      };

      $scope.changePage = function(page){
            $scope.loader = true;
            $scope.page = $scope.values.slice((page-1)*$scope.pageSize, (page-1) * $scope.pageSize + $scope.pageSize);
            $scope.currentPage = page;
            $scope.scrollUp();
      };
 
      $scope.sortValues = function(index, direction){
            if(direction){
                $scope.values = $scope.values.sort(function(a,b){
                    if(angular.isString(a[index])){
                        var a_string=a[index].toLowerCase();
                        var b_string=b[index].toLowerCase();
                        if (a_string < b_string){
                          return -1 
                        }
                        if (a_string > b_string){
                           return 1 
                        }
                         return 0 
                    } else {
                        return a[index] - b[index]
                    }
                });
            } else {
                $scope.values = $scope.values.sort(function(a,b){
                    if(angular.isString(a[index]) && angular.isString(b[index])){
                        var a_string=a[index].toLowerCase();
                        var b_string=b[index].toLowerCase();
                        if (a_string > b_string){
                          return -1 
                        }
                        if (a_string < b_string){
                           return 1 
                        }
                         return 0 
                    } else {
                        return b[index] - a[index]
                    }
                });
            };
            $scope.changePage($scope.currentPage);
      };

      $scope.scrollUp = function(){
         $("#wrapper").animate({scrollTop: 0}, 600);
         $scope.loader = false;
      };

      $scope.fetchReportsList();
      $scope.openCalendar('date_to');
      $scope.openCalendar('period_date', true);
      $scope.openCalendar('date_from');
    });
