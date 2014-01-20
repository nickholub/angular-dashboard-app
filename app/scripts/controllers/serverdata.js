'use strict';

angular.module('app')
  .controller('ServerDataCtrl', function ($scope, webSocket, settings) {
    var widgetDefinitions = [
      {
        name: 'wt-scope-watch',
        attrs: {
          value: 'serverValue'
        }
      },
      {
        name: 'wt-top-n',
        attrs: {
          data: 'serverTopTen'
        }
      }
    ];

    var defaultWidgets = _.clone(widgetDefinitions);

    $scope.dashboardOptions = {
      widgetButtons: true,
      widgetDefinitions: widgetDefinitions,
      defaultWidgets: defaultWidgets
    };

    $scope.serverValue = 0;
    webSocket.subscribe(settings.randomValueTopic, function (message) {
      $scope.serverValue = message.value;
      $scope.$apply();
    }, $scope);

    webSocket.subscribe(settings.topNTopic, function (message) {
      var list = [];
      _.each(message, function(value, key) {
        list.push( { name: key, value: parseInt(value, 10) } );
      });

      $scope.serverTopTen = list;
      $scope.$apply();
    }, $scope);
  });