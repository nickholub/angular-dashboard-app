'use strict';

angular.module('app').controller('DashboardController', function ($scope) {
  $scope.sortableOptions = { //TODO
  };
});

angular.module('app').directive('dashboard', function () {
  return {
    restrict: 'EA',
    templateUrl: 'scripts/widgets/dashboard.html',
    scope: true,
    controller: 'DashboardController',
    link: function (scope, element, attrs) {
      scope.widgets = scope[attrs.widgets];
    }
  };
});