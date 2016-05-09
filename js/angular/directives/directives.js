ngApp.directive('ifcan', ['Auth', function (Auth) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
          var makeVisible = function () {
                  element.removeClass('hidden');
              },
              makeHidden = function () {
                  element.addClass('hidden');
              },
              determineVisibility = function (resetFirst) {
                  var result;
                  if (resetFirst) {
                      makeVisible();
                  }
                  result = Auth.authorize(true, permissions);
                  if (result === 1) {
                      makeVisible();
                  } else {
                      makeHidden();
                  }
              },
              permissions = attrs.ifcan.split(',');

          if (permissions.length > 0) {
              determineVisibility(true);
          }
      }
    };
}]);

ngApp.directive('ifcant', ['Auth', function (Auth) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
          var makeVisible = function () {
                  element.removeClass('hidden');
              },
              makeHidden = function () {
                  element.addClass('hidden');
              },
              determineVisibility = function (resetFirst) {
                  var result;
                  if (resetFirst) {
                      makeVisible();
                  }
                  result = Auth.authorize(true, permissions);
                  if (result === 0) {
                      makeVisible();
                  } else {
                      makeHidden();
                  }
              },
              permissions = attrs.ifcant.split(',');

          if (permissions.length > 0) {
              determineVisibility(true);
          }
      }
    };
}]);

ngApp.directive('driver', function(){
  return {
    restrict: 'E',
    scope: {
      driver: '='
    },
    templateUrl: '/templates/directives/driver_box.html'  
  };
});

ngApp.directive('vehicle', function(){
  return {
    restrict: 'E',
    scope: {
      vehicle: '='
    },
    templateUrl: '/templates/directives/vehicle_box.html'  
  };
});


ngApp.directive('onlyDigits', function() {
  return {
    require: 'ngModel',
    link: function (scope, element, attr, ngModelCtrl) {
      function fromUser(text) {
        var transformedInput = text.replace(/[^0-9]/g, '');
        if(transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
        }
        return transformedInput;  // or return Number(transformedInput)
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  }; 
});

ngApp.directive('timeParser', function() {
  return {
    require: 'ngModel',
    link: function (scope, element, attr, ngModelCtrl) {
      function fromUser(text) {
        var transformedInput = text.replace(/[^0-9]/g, '');
        patt = new RegExp("^([0-1][0-9]|2[0-3]):([0-5][0-9])$");
        hPatt = new RegExp("^([0-1][0-9]|2[0-3])");
        if (transformedInput.length > 4) {
          transformedInput = transformedInput.substring(0,4);
        };

        if (transformedInput.length > 2) {
          transformedInput = transformedInput.slice(0,2) + ":" + transformedInput.slice(2);
          if (!hPatt.test(transformedInput)) {
            transformedInput = "23" + transformedInput.slice(2);
            if (!patt.test(transformedInput)) {
              transformedInput = transformedInput.slice(0,2) + ":59";
            }
          }
        };

        if(transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
        }
        return transformedInput;  // or return Number(transformedInput)
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  }; 
});

ngApp.directive('allowTab', function () {
        return {
            require: 'ngModel',
            link: function(scope, ele, attrs, c) {
                ele.bind('keydown keyup', function(e) {
                    var val = this.value;
                    console.log(val);
                    if (e.keyCode === 9 && e.type === 'keydown') { // tab was pressed

                        // get caret position/selection
                        var start = this.selectionStart,
                            end = this.selectionEnd;

                        // set textarea value to: text before caret + tab + text after caret
                        this.value = val.substring(0, start) + '\t' + val.substring(end);

                        // put caret at right position again
                        this.selectionStart = this.selectionEnd = start + 1;

                        c.$setValidity('allowTab', true);
                        e.preventDefault();
                        // prevent the focus lose
                        return false;

                    }
                    else if(e.keyCode !== 9 && e.type === 'keyup') {
                        if(val === '') {
                            c.$setValidity('allowTab', false);
                        }
                        else {
                            c.$setValidity('allowTab', true);
                        }
                    }
                });
             }
        }
    });