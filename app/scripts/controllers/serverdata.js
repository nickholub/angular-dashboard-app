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
      },
      {
        name: 'topics',
        templateUrl: 'template/topics.html'
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
      }, $scope);

      $scope.serverTopTen = list;
      $scope.$apply();
    }, $scope);
  })
  .controller('TopicCtrl', function ($scope, webSocket) {
    webSocket.subscribe('_latestTopics', function (message) {
      $scope.topics = message;
      if (message.length) {
        $scope.topic = message[0];
      }
      $scope.$apply();
    }, $scope);
    webSocket.send({ type: 'getLatestTopics' });

    var callback = function (message) {
      $scope.topicData = JSON.stringify(message, null, ' ');
      $scope.$apply();
    };

    $scope.$watch('topic', function (newTopic, oldTopic) {
      if (oldTopic && callback) {
        webSocket.unsubscribe(oldTopic, callback);
      }

      if (newTopic) {
        $scope.topicData = 'Loading...';
        webSocket.subscribe(newTopic, callback, $scope);
      }
    });
  });