'use strict';

angular.module('app')
  .controller('WidgetOptionsCtrl', function ($scope, webSocket, Gateway, settings) {
    $scope.dataSourceName = 'Gateway (' + settings.gatewayHost + ')'; //TODO

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

    var widget = $scope.widget;

    if (widget && widget.dataModel) {
      $scope.topics = [];
      if (widget.dataTypes) {
        $scope.dataTypes = widget.dataTypes.join(', ');
      }

      Gateway.getTopics().then(function (topics) {
        if (widget.dataTypes) {
          topics = _.reject(topics, function (topic) {
            return !topic.schema || !_.contains(widget.dataTypes, topic.schema.type);
          });
        }

        $scope.topics = topics;
        $scope.topic = _.findWhere($scope.topics, {topic: widget.dataModel.topic});
      });

      $scope.$watch('topic', function (newTopic) {
        if (newTopic && (newTopic.topic !== widget.dataModel.topic)) {
          console.log(widget.dataModel);
          widget.dataModel.update(newTopic.topic);
        }
      });

      $scope.selectTopic = function (topic) {
        $scope.topic = topic;
      };
    }
  });