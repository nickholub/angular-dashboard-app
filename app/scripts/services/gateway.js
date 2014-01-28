'use strict';

angular.module('app.service')
  .factory('Gateway', function ($rootScope, $q, webSocket) {
    return {
      getTopics: function () {
        var deferred = $q.defer();

        webSocket.subscribe('_latestTopics', function (message) {
          var list = _.reject(message, function (topic) {
            return topic.indexOf('application_') !== 0;
          });

          var topics = _.map(list, function (topic) {
            var schemaInd = topic.indexOf('{');
            var name = topic;
            var type = null;
            var schema = {};

            if (schemaInd > 0) {
              var start = topic.indexOf('visualdata');
              var end = schemaInd - 1;
              name = topic.substr(start, end - start);
              var schemaStr = topic.substr(schemaInd);
              schema = JSON.parse(schemaStr);
              type = schema.type;
            } else {
              topic = topic;
              name = topic;
            }

            return {
              topic: topic,
              name: name,
              schema: schema,
              type: type
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
