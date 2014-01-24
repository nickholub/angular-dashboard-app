'use strict';

angular.module('app')
  .controller('ServerDataCtrl', function ($scope, webSocket, settings, RandomValueDataSource, WebSocketDataSource, TimeSeriesDataSource) {
    $scope.value1 = 'not defined';
    $scope.value2 = 'not defined';

    var widgetDefinitions = [
      {
        name: 'value1',
        directive: 'wt-scope-watch',
        dataAttrName: 'value',
        dataSourceType: RandomValueDataSource,
        style: {
          width: '30%'
        }
      },
      {
        name: 'value2',
        directive: 'wt-scope-watch',
        dataAttrName: 'value',
        dataSourceType: WebSocketDataSource,
        dataSourceOptions: {
          defaultTopic: 'app.visualdata.piValue'
        },
        style: {
          width: '30%'
        }
      },
      {
        name: 'value3',
        directive: 'wt-scope-watch',
        dataAttrName: 'value',
        dataSourceType: WebSocketDataSource,
        dataSourceOptions: {
          defaultTopic: 'app.visualdata.chartValue'
        },
        style: {
          width: '30%'
        }
      },
      {
        name: 'chart1',
        directive: 'wt-line-chart',
        dataAttrName: 'chart',
        dataSourceType: TimeSeriesDataSource,
        dataSourceOptions: {
          defaultTopic: 'app.visualdata.chartValue_{type:\'timeseries\',minValue:0,maxValue:100}' //TODO
        },
        style: {
          width: '50%'
        }
      },
      {
        name: 'chart2',
        directive: 'wt-line-chart',
        dataAttrName: 'chart',
        dataSourceType: TimeSeriesDataSource,
        dataSourceOptions: {
          defaultTopic: 'app.visualdata.chartValue2_{type:\'timeseries\',minValue:0,maxValue:100}' //TODO
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
        name: 'wt-gauge',
        dataAttrName: 'value',
        dataSourceType: WebSocketDataSource,
        dataSourceOptions: {
          defaultTopic: 'app.visualdata.percentage_{type:\'percentage\'}' //TODO
        },
        style: {
          width: '250px'
        }
      },
      {
        name: 'progressbar',
        attrs: {
          class: 'progress-striped',
          type: 'success'
        },
        dataAttrName: 'value',
        dataSourceType: WebSocketDataSource,
        dataSourceOptions: {
          defaultTopic: 'app.visualdata.percentage_{type:\'percentage\'}' //TODO
        },
        style: {
          width: '30%'
        }
      },
      {
        name: 'wt-top-n',
        attrs: {
          data: 'serverTopTen'
        },
        dataAttrName: 'data',
        dataSourceType: WebSocketDataSource,
        dataSourceOptions: {
          defaultTopic: 'app.visualdata.topn_{type:\'topN\',n:10}' //TODO
        }
      }
    ];

    var defaultWidgets = _.clone(widgetDefinitions);

    $scope.dashboardOptions = {
      widgetButtons: true,
      widgetDefinitions: widgetDefinitions,
      defaultWidgets: defaultWidgets,
      optionsTemplateUrl: 'template/widgetOptions.html'
    };

    //TODO
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
        //$scope.$emit('topic', newTopic); //TODO
        //$rootScope.$broadcast('topic', newTopic);
      }
    });
  })
  .controller('WidgetOptionsCtrl', function ($scope, webSocket) {
    var widget = $scope.widget;
    if (widget && widget.dataSource) {
      $scope.topic = widget.dataSource.topic;

      // load available topics
      webSocket.subscribe('_latestTopics', function (message) {
        var list = _.reject(message, function (topic) {
          return topic.indexOf('applications.') >= 0;
        });
        $scope.topics = _.sortBy(list, function (topic) {
          return topic;
        });

        //TODO unsubscribe webSocket.get(request).then(...);

        $scope.$apply();
      }, $scope);
      webSocket.send({ type: 'getLatestTopics' });

      $scope.$watch('topic', function (newTopic) {
        if (newTopic && (newTopic !== widget.dataSource.topic)) {
          widget.dataSource.update(newTopic);
        }
      });
    }
  });