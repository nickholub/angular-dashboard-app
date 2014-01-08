'use strict';

angular.module('app').controller('MainCtrl', function ($scope, $interval) {
  var widgetDefinitions = [
    {
      directive: 'time',
      style: {
        width: '33%'
      }
    },
    {
      directive: 'random',
      style: {
        width: '33%'
      }
    },
    {
      directive: 'scope-watch',
      attrs: {
        value: 'randomValue'
      },
      style: {
        width: '34%'
      }
    },
    {
      directive: 'top-n',
      attrs: {
        data: 'topTen'
      },
      style: {
        width: '50%'
      }
    },
    {
      directive: 'progressbar',
      attrs: {
        class: 'progress-striped',
        type: 'success',
        value: 'progress'
      },
      style: {
        width: '30%'
      }
    }
  ];

  var defaultWidgets = _.clone(widgetDefinitions);

  $scope.dashboardOptions = {
    widgetDefinitions: widgetDefinitions,
    defaultWidgets: defaultWidgets
  };

  // random scope value (scope-watch widget)
  $interval(function () {
    $scope.randomValue = Math.random();
  }, 500);

  // top 10 (topN widget)
  $interval(function () {
    var topTen = _.map(_.range(1, 11), function (index) {
      return {
        name: 'item' + index,
        value: Math.floor(Math.random() * 100)
      };
    });
    $scope.topTen = topTen;
  }, 1000);

  // progress bar (progressbar widget)
  $scope.progress = 10;
  $interval(function () {
    $scope.progress = ($scope.progress + 10) % 100;
  }, 1000);

  // external controls
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