'use strict';

angular.module('app').controller('MainCtrl', function ($scope, $interval) {
  $interval(function () {
    $scope.randomValue = Math.random();
  }, 500);

  var dashboardWidgets = [];

  dashboardWidgets.push({
    title: 'Widget 1',
    directive: 'two'
  });

  dashboardWidgets.push({
    title: 'Widget 2',
    directive: 'one'
  });

  dashboardWidgets.push({
    title: 'Widget 3',
    directive: 'two'
  });

  dashboardWidgets.push({
    title: 'Widget 4',
    directive: 'scope-watch',
    options: {
      propertyName: 'randomValue'
    }
  });

  $scope.dashboardWidgets = dashboardWidgets;

  var count = $scope.dashboardWidgets.length + 1;

  $scope.addWidget = function (id) {
    $scope.dashboardWidgets.push({
      title: 'Widget ' + count++,
      directive: id
    });
  };

  $scope.addWidgetScopeWatch = function () {
    $scope.dashboardWidgets.push({
      title: 'Widget ' + count++,
      directive: 'scope-watch',
      options: {
        varName: 'randomValue'
      }
    });
  };

  $scope.removeWidget = function (widget) {
    $scope.dashboardWidgets.splice(_.indexOf($scope.dashboardWidgets, widget), 1);
  };
});