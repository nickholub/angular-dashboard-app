'use strict';

angular.module('ui.dashboard.widgets')
  .directive('topN', function () {
    return {
      restrict: 'A',
      templateUrl: 'scripts/widgets/topN/topN.html',
      controller: function ($scope) {
        $scope.gridOptions = {
          data: 'items',
          enableRowSelection: false,
          enableColumnResize: false,
          columnDefs: [
            { field: 'name', displayName: 'Name' },
            { field: 'value', displayName: 'Value' }
          ]
        };
      },
      link: function postLink(scope, element, attrs) {
        var options = scope.widget.options;

        if (options && options.propertyName) {
          scope.$watch(options.propertyName, function (list) {
            scope.items = _.sortBy(list, function (item) {
              return (- item.value);
            });
          });
        }
      }
    };
  });