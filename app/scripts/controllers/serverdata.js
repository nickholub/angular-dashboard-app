'use strict';

angular.module('app')
  .controller('ServerDataCtrl', function ($scope, webSocket, settings) {
    var widgetDefinitions = [
      {
        name: 'chart1',
        directive: 'wt-line-chart',
        attrs: {
          chart: 'chart'
        },
        style: {
          width: '50%'
        }
      },
      {
        name: 'chart2',
        directive: 'wt-line-chart',
        attrs: {
          chart: 'chart2'
        },
        style: {
          width: '50%'
        }
      },
      {
        name: 'topics',
        templateUrl: 'template/topics.html'
      },
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
      _.each(message, function (value, key) {
        list.push({ name: key, value: parseInt(value, 10) });
      }, $scope);

      $scope.serverTopTen = list;
      $scope.$apply();
    }, $scope);

    // line chart
    function chartData(topic, propertyName) {
      var max = 30;
      var data = [];
      webSocket.subscribe(topic, function (value) {
        var now = Date.now();
        data.push({
          timestamp: now,
          value: value
        });

        if (data.length > 100) { //TODO
          data.shift();
        }

        $scope[propertyName] = {
          data: data,
          max: max
        };

        $scope.$apply();
      }, $scope);
    }

    chartData('app.visualdata.chartValue', 'chart');
    chartData('app.visualdata.chartValue2', 'chart2');
  })
  .controller('TopicCtrl', function ($scope, webSocket) {
    webSocket.subscribe('_latestTopics', function (message) {
      var list = _.reject(message, function (topic) {
        return topic.indexOf('applications.') >= 0;
      });
      $scope.topics = _.sortBy(list, function (topic) {
        return topic;
      });
      if (message.length) {
        $scope.topic = $scope.topics[0];
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