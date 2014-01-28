'use strict';

angular.module('app')
  .controller('TopicCtrl', function ($scope, webSocket, Gateway) {
    $scope.prevTopic = function () {
      var index = $scope.topics.indexOf($scope.topic);
      var prev = ($scope.topics.length + index - 1) % $scope.topics.length;
      $scope.topic = $scope.topics[prev];
    };

    $scope.nextTopic = function () {
      var index = $scope.topics.indexOf($scope.topic);
      var next = (index + 1) % $scope.topics.length;
      $scope.topic = $scope.topics[next];
    };

    $scope.selectTopic = function (topic) {
      $scope.topic = topic;
    };

    var callback = function (message) {
      $scope.topicData = JSON.stringify(message, null, ' ');
      $scope.$apply();
    };

    $scope.$watch('topic', function (newTopic, oldTopic) {
      if (oldTopic && callback) {
        webSocket.unsubscribe(oldTopic.topic, callback);
      }

      if (newTopic) {
        $scope.topicData = 'Loading...';
        $scope.topicSchema = JSON.stringify(newTopic.schema, null, ' ');
        webSocket.subscribe(newTopic.topic, callback, $scope);
      }
    });

    $scope.topics = [];

    Gateway.getTopics().then(function (topics) {
      $scope.topics = topics;
      if (topics.length) {
        $scope.topic = $scope.topics[0];
      }
    });
  });