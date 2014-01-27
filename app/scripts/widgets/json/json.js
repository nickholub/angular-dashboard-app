'use strict';

angular.module('ui.dashboard.widgets')
  .filter('json', function () {
    return function (input) {
      return JSON.stringify(input, null, ' ');
    };
  })
  .directive('wtJson', function () {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'scripts/widgets/json/json.html',
      scope: {
        value: '=value'
      }
    };
  });