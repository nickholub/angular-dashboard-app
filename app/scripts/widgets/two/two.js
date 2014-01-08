'use strict';

angular.module('ui.dashboard.widgets')
  .directive('two', function ($interval) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'scripts/widgets/two/two.html',
      link: function postLink(scope, element, attrs) {
        function update() {
          scope.number = Math.floor(Math.random() * 100);
        }

        var promise = $interval(update, 500);

        scope.$on('$destroy', function () {
          $interval.cancel(promise);
        });
      }
    };
  });