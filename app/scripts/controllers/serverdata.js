'use strict';

angular.module('app')
  .controller('ServerDataCtrl', function ($scope, webSocket, settings, RandomValueDataSource, WebSocketDataSource, TimeSeriesDataSource) {
    $scope.value1 = 'not defined';
    $scope.value2 = 'not defined';

    var widgetDefinitions = [
      {
        name: 'Value',
        directive: 'wt-scope-watch',
        dataAttrName: 'value',
        attrs: {
          'value-class': 'alert-info'
        },
        dataTypes: ['percentage', 'simple'],
        dataSourceType: WebSocketDataSource,
        dataSourceOptions: {
          defaultTopic: settings.topic.visualdata.piValue
        }
      },
      {
        name: 'Progressbar',
        directive: 'progressbar',
        attrs: {
          class: 'progress-striped',
          type: 'success'
        },
        dataAttrName: 'value',
        dataTypes: ['percentage', 'simple'],
        dataSourceType: WebSocketDataSource,
        dataSourceOptions: {
          defaultTopic: settings.topic.visualdata.percentage
        }
      },
      {
        name: 'Line Chart',
        directive: 'wt-line-chart',
        dataAttrName: 'chart',
        dataTypes: ['timeseries'],
        dataSourceType: TimeSeriesDataSource,
        dataSourceOptions: {
          defaultTopic: settings.topic.visualdata.chartValue
        },
        style: {
          width: '50%'
        }
      },
      {
        name: 'TopN',
        directive: 'wt-top-n',
        attrs: {
          data: 'serverTopTen'
        },
        dataAttrName: 'data',
        dataTypes: ['topN'],
        dataSourceType: WebSocketDataSource,
        dataSourceOptions: {
          defaultTopic: settings.topic.visualdata.topn
        }
      },
      {
        name: 'Gauge',
        directive: 'wt-gauge',
        dataAttrName: 'value',
        dataTypes: ['percentage', 'simple'],
        dataSourceType: WebSocketDataSource,
        dataSourceOptions: {
          defaultTopic: settings.topic.visualdata.percentage
        },
        style: {
          width: '250px'
        }
      },
      {
        name: 'Topics',
        templateUrl: 'template/topics.html'
      },
      {
        name: 'JSON',
        directive: 'wt-json',
        dataAttrName: 'value',
        dataSourceType: WebSocketDataSource,
        dataSourceOptions: {
          defaultTopic: settings.topic.visualdata.topn
        }
      }
    ];

    function find(name) {
      return _.findWhere(widgetDefinitions, {name: name});
    }

    function copy(name, extend) {
      var dest = angular.copy(find(name));

      if (extend) {
        angular.extend(dest, extend);
      }

      return dest;
    }

    //var defaultWidgets = _.clone(widgetDefinitions);
    var defaultWidgets = [
      copy('Value', {
        title: 'Value 1'
      }),
      copy('Value', {
        title: 'Value 2',
        dataSourceOptions: {
          defaultTopic: settings.topic.visualdata.percentage
        }
      }),
      copy('Progressbar', {
        title: 'Progressbar'
      }),
      copy('Line Chart', {
        title: 'Line Chart 1'
      }),
      copy('Line Chart', {
        title: 'Line Chart 2',
        dataSourceOptions: {
          defaultTopic: settings.topic.visualdata.chartValue2
        }
      }),
      copy('TopN', {
        title: 'Top N'
      }),
      copy('Gauge', {
        title: 'Gauge'
      }),
      copy('JSON', {
        title: 'JSON'
      }),
      copy('Topics', {
        title: 'WebSocket Topics'
      })
    ];

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
  });