'use strict';

angular.module('app').controller('MainCtrl', function ($scope, $interval) {
  $scope.dashboardOptions = {};

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

  $scope.addWidget = function (id) {
    $scope.dashboardOptions.addWidget(id);
  };

  $scope.addWidgetScopeWatch = function () {
    $scope.dashboardOptions.addWidget('scope-watch',
      {
        propertyName: 'randomValue'
      });
  };
});