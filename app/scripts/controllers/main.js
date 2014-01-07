'use strict';

angular.module('app').controller('MainCtrl', function () {
  //TODO
})
  .controller('DashboardCtrl', function ($scope) {
    var widgets = [];

    widgets.push({
      title: 'Widget 1',
      kind: 'two'
    });

    widgets.push({
      title: 'Widget 2',
      kind: 'one'
    });

    widgets.push({
      title: 'Widget 3',
      kind: 'two'
    });

    $scope.widgets = widgets;

    $scope.sortableOptions = { //TODO
    };

    var count = $scope.widgets.length + 1;
    $scope.addWidget = function (id) {
      $scope.widgets.push({
        title: 'Widget ' + count++,
        kind: id
      });
    };

    $scope.removeWidget = function (widget) {
      $scope.widgets.splice(_.indexOf($scope.widgets, widget), 1);
    };
  });
