'use strict';

angular.module('ui.dashboard').directive('widget', ['$compile', function ($compile) {
  return {
    require: '^dashboard',
    link: function (scope, element) {
      var elm = element.find('.widget-content');
      elm.attr(scope.widget.directive, '');

      $compile(elm)(scope);
    }
  };
}]);