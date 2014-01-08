'use strict';

angular.module('ui.dashboard.widgets')
  .directive('one', function ($interval) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'scripts/widgets/one/one.html',
      link: function (scope) {
        function update() {
          scope.time = new Date().toLocaleTimeString();
        }

        var promise = $interval(update, 500);

        scope.$on('$destroy', function () {
          $interval.cancel(promise);
        });
      }
    };
  });