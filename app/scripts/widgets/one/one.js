angular.module('app').directive('one', function ($timeout) {
  return {
    restrict: 'A',
    templateUrl: 'scripts/widgets/one/one.html',
    link: function postLink(scope, element, attrs) {
      function update() {
        scope.time = new Date().toLocaleTimeString();
        $timeout(update, 500);
      }

      update();
    }
  };
});