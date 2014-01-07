angular.module('app').directive('scopeWatch', function ($interval) {
  return {
    restrict: 'A',
    templateUrl: 'scripts/widgets/scopeWatch/scopeWatch.html',
    link: function postLink(scope, element, attrs) {
      var options = scope.widget.options;

      if (options && options.varName) {
        scope.$watch(options.varName, function (value) {
          scope.scopeValue = value;
        });
      }
    }
  };
});