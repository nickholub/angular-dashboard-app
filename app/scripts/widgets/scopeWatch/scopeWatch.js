'use strict';

angular.module('ui.dashboard.widgets')
  .directive('scopeWatch', function () {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'scripts/widgets/scopeWatch/scopeWatch.html',
      scope: {
        scopeValue: '=value'
      }
    };
  });