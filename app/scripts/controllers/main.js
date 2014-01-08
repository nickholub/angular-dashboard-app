'use strict';

angular.module('app').controller('MainCtrl', function ($scope, $interval) {
  var widgetDefinitions = [
    {
      directive: 'one'
    },
    {
      directive: 'two'
    },
    {
      directive: 'scope-watch',
      options: {
        propertyName: 'randomValue'
      }
    }
  ];

  var defaultWidgets = _.clone(widgetDefinitions);

  $scope.dashboardOptions = {
    widgetDefinitions: widgetDefinitions,
    defaultWidgets: defaultWidgets
  };

  $interval(function () {
    $scope.randomValue = Math.random();
  }, 500);

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