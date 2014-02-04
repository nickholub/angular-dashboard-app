'use strict';

angular.module('app.service')
  .factory('Gateway', function ($rootScope, $q, $http, webSocket, settings) {
    return {
      getDataTopics: function () {
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
              appId: topicData.appId,
              name: topicData.topicName,
              schema: topicData.schema,
              type: topicData.schema.type
            };
          });

          deferred.resolve(topics);
          //$rootScope.$apply();
        }, $rootScope);
        webSocket.send({ type: 'getLatestTopics' });
        //TODO unsubscribe

        return deferred.promise;
      },

      getRunningApps: function () {
        var deferred = $q.defer();

        var url = settings.restBaseURL + 'applications?states=running&jsonp=JSON_CALLBACK';
        $http.jsonp(url)
          .success(function (data) {
            if (data && data.apps && data.apps.length > 0) {
              var apps = _.reject(data.apps, function (app) {
                return app.state !== 'RUNNING';
              });
              apps = _.sortBy(apps, function (app) {
                return (-app.startedTime);
              });

              deferred.resolve(apps);
            }
          });

        return deferred.promise;
      },

      getTopics: function () {
        var deferred = $q.defer();

        var topicsPromise = this.getDataTopics();
        var appsPromise = this.getRunningApps();

        $q.all({ topics: topicsPromise, apps: appsPromise }).then(function (resolutions) {
          var topics = resolutions.topics;
          var apps = resolutions.apps;

          var appIdMap = {};
          _.each(apps, function (app) {
            appIdMap[app.id] = app;
          });

          topics = _.reject(topics, function (topic) {
            return !appIdMap.hasOwnProperty(topic.appId);
          });

          _.each(topics, function (topic) {
            var app = appIdMap[topic.appId];
            topic.appName = app.name;
            topic.appStartedTime = app.startedTime;
          });

          topics = _.sortBy(topics, function (topic) {
            return topic.name;
          });

          deferred.resolve(topics);
        });

        return deferred.promise;
      }
    };
  });
