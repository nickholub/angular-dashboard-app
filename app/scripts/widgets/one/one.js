'use strict';

angular.module('ui.dashboard.widgets')
  .directive('one', function ($interval) {
    return {
      restrict: 'A',
      templateUrl: 'scripts/widgets/one/one.html',
      link: function postLink(scope, element, attrs) {
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