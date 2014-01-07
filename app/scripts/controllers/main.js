'use strict';

angular.module('app').controller('MainCtrl', function ($scope) {
  var widgets = [];

  widgets.push({
    title: 'Widget 1',
    directive: 'two'
  });

  widgets.push({
    title: 'Widget 2',
    directive: 'one'
  });

  widgets.push({
    title: 'Widget 3',
    directive: 'two'
  });

  $scope.widgets = widgets;

  var count = $scope.widgets.length + 1;

  $scope.addWidget = function (id) {
    $scope.widgets.push({
      title: 'Widget ' + count++,
      directive: id
    });
  };

  $scope.removeWidget = function (widget) {
    $scope.widgets.splice(_.indexOf($scope.widgets, widget), 1);
  };
});