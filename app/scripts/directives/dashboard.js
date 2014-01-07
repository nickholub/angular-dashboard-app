'use strict';

angular.module('ui.dashboard.widgets', []);

angular.module('ui.dashboard', ['ui.sortable', 'ui.dashboard.widgets']);

angular.module('ui.dashboard')
  .controller('DashboardController', function ($scope) {
    //TODO store active widgets in local storage on add/remove/reorder
    $scope.sortableOptions = {
      stop: function () {
        var titles = _.map($scope.widgets, function (widget) {
          return widget.title;
        });
        console.log(titles);
      }
    };
  })
  .directive('dashboard', function () {
    return {
      restrict: 'A',
      templateUrl: 'scripts/widgets/dashboard.html',
      scope: true,
      controller: 'DashboardController',
      link: function (scope, element, attrs) {
        scope.widgets = scope.$eval(attrs.widgets);
        scope.options = scope.$eval(attrs.dashboard);

        var count = scope.widgets.length + 1;

        scope.addWidget = function (directive, options) {
          scope.widgets.push({
            title: 'Widget ' + count++,
            directive: directive,
            options: options
          });
        };

        scope.removeWidget = function (widget) {
          scope.widgets.splice(_.indexOf(scope.widgets, widget), 1);
        };

        // allow adding widgets externally
        scope.options.addWidget = scope.addWidget;
      }
    };
  });