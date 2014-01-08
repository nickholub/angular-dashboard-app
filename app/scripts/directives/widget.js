'use strict';

angular.module('ui.dashboard').directive('widget', ['$compile', function ($compile) {
  return {
    require: '^dashboard',
    link: function (scope, element) {
      var elm = element.find('.widget-content > div');

      var widget = scope.widget;
      elm.attr(widget.directive, '');

      if (widget.attrs) {
        _.each(widget.attrs, function (value, attr) {
          elm.attr(attr, value);
        });
      }

      $compile(elm)(scope);
    }
  };
}]);