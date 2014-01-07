'use strict';

angular.module('app').directive('widget', ['$compile', function ($compile) {
  return {
    link: function (scope, element) {
      var elm = element.find('.widget-content');
      elm.attr(scope.widget.kind, '');

      $compile(elm)(scope);
    }
  };
}]);