'use strict';

angular.module('app.service')
  .factory('Gateway', function ($rootScope, $q, webSocket) {
    return {
      getTopics: function () {
        var deferred = $q.defer();

        webSocket.subscribe('_latestTopics', function (message) {
          var list = _.reject(message, function (topic) {
            return topic.indexOf('AppData{\"schema\"') !== 0;
          });

          var topics = _.map(list, function (topic) {
            var jsonInd = topic.indexOf('{');

            var jsonString = topic.substr(jsonInd);

            var topicData = JSON.parse(jsonString);

            return {
              topic: topic,
              name: topicData.topicName,
              schema: topicData.schema,
              type: topicData.schema.type
            };
          });

          topics = _.sortBy(topics, function (topic) {
            return topic.name;
          });

          deferred.resolve(topics);
          $rootScope.$apply();
        }, $rootScope);
        webSocket.send({ type: 'getLatestTopics' });

        return deferred.promise;
      }
    };
  });
