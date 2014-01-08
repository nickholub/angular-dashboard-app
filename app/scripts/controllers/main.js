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
    },
    {
      directive: 'top-n',
      options: {
        propertyName: 'topTen'
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

  $interval(function () {
    var topTen = [];
    topTen = _.map(_.range(1, 11), function (index) {
      return {
        name: 'item' + index,
        value: Math.floor(Math.random() * 100)
      };
    });
    $scope.topTen = topTen;
  }, 1000);

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