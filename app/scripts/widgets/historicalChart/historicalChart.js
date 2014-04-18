'use strict';

angular.module('ui.dashboard.widgets')
  .directive('wtHistoricalChart', function () {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'scripts/widgets/historicalChart/historicalChart.html',
      scope: {
        chart: '='
      },
      controller: function ($scope) {
        $scope.mode = 'MINUTES';

        $scope.changeMode = function (mode) {
          $scope.mode = mode;
          $scope.$emit('modeChanged', mode);
        };
      }
    };
  });