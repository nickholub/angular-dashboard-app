'use strict';

angular.module('ui.dashboard.widgets')
  .directive('scopeWatch', function () {
    return {
      restrict: 'A',
      templateUrl: 'scripts/widgets/scopeWatch/scopeWatch.html',
      link: function postLink(scope, element, attrs) {
        var options = scope.widget.options;

        if (options && options.propertyName) {
          scope.$watch(options.propertyName, function (value) {
            scope.scopeValue = value;
          });
        }
      }
    };
  });