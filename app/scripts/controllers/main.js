'use strict';

angular.module('app').controller('MainCtrl', function ($scope, $interval) {
  var widgetDefinitions = [
    {
      directive: 'time'
    },
    {
      directive: 'random'
    },
    {
      directive: 'scope-watch',
      attrs: {
        value: 'randomValue'
      }
    },
    {
      directive: 'top-n',
      attrs: {
        data: 'topTen'
      }
    },
    {
      directive: 'progressbar',
      attrs: {
        class: 'progress-striped',
        type: 'success',
        value: 'progress'
      }
    },
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

  $scope.progress = 10;

  $interval(function () {
    $scope.progress = ($scope.progress + 10) % 100;
  }, 1000);

  $scope.addWidget = function (id) {
    $scope.dashboardOptions.addWidget(id);
  };

  $scope.addWidgetScopeWatch = function () {
    $scope.dashboardOptions.addWidget('scope-watch',
      {
        value: 'randomValue'
      });
  };
});