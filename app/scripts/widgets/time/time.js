'use strict';

angular.module('ui.dashboard.widgets')
  .directive('time', function ($interval) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'scripts/widgets/time/time.html',
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