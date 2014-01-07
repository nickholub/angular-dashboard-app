'use strict';

angular.module('app').directive('widget', ['$compile', function ($compile) {
  return {
    require: '^dashboard',
    link: function (scope, element) {
      var elm = element.find('.widget-content');
      elm.attr(scope.widget.directive, '');

      $compile(elm)(scope);
    }
  };
}]);