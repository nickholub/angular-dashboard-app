'use strict';

angular.module('ui.dashboard.widgets')
  .directive('wtPieChart', function () {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'scripts/widgets/pieChart/pieChart.html',
      scope: {
        data: '=data'
      },
      controller: function ($scope) {
        $scope.xFunction = function(){
          return function(d) {
            return d.key;
          };
        };
        $scope.yFunction = function(){
          return function(d) {
            return d.y;
          };
        };

        $scope.descriptionFunction = function(){
          return function(d){
            return d.key + ' ' + d.y;
          };
        };
      }
    };
  });