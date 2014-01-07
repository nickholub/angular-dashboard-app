angular.module('app').directive('two', function ($timeout) {
  return {
    restrict: 'A',
    templateUrl: 'scripts/widgets/two/two.html',
    link: function postLink(scope, element, attrs) {
      function update() {
        scope.number = Math.floor(Math.random() * 100);
        $timeout(update, 500);
      }

      update();
    }
  };
});