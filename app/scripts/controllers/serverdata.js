'use strict';

angular.module('app')
  .controller('ServerDataCtrl', function ($scope, webSocket, Gateway, settings, RandomValueDataSource, WebSocketDataSource, TimeSeriesDataSource, PieChartDataSource) {
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
          defaultTopic: settings.topic.visualdata.progress
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
        name: 'Pie Chart',
        directive: 'wt-pie-chart',
        style: {
          width: '350px',
          height: '350px'
        },
        dataAttrName: 'data',
        dataTypes: ['topN'],
        dataSourceType: PieChartDataSource,
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
        name: 'JSON',
        directive: 'wt-json',
        dataAttrName: 'value',
        dataSourceType: WebSocketDataSource,
        dataSourceOptions: {
          defaultTopic: settings.topic.visualdata.topn
        }
      },
      {
        name: 'WebSocket Debugger',
        templateUrl: 'template/topics.html'
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
      copy('Pie Chart', {
        title: 'Pie Chart'
      }),
      copy('Gauge', {
        title: 'Gauge'
      }),
      copy('JSON', {
        title: 'JSON'
      }),
      copy('WebSocket Debugger', {
        title: 'WebSocket Debugger'
      })
    ];

    $scope.dashboardOptions = {
      useLocalStorage: false, //TODO enable by default
      widgetButtons: true,
      widgetDefinitions: widgetDefinitions,
      defaultWidgets: defaultWidgets,
      optionsTemplateUrl: 'template/widgetOptions.html'
    };

    // initialize widgets with default topics
    var topicsPromise = Gateway.getTopics();

    $scope.$on('widgetAdded', function (event, widget) {
      event.stopPropagation();

      if (widget.dataSource && widget.dataSourceOptions && widget.dataSourceOptions.defaultTopic) {
        topicsPromise.then(function (topics) {
          var defaultTopic = widget.dataSourceOptions.defaultTopic;

          var topic = _.find(topics, function (topic) {
            return topic.name.indexOf(defaultTopic) >= 0;
          });

          if (topic) {
            widget.dataSource.update(topic.topic);
          }
        });
      }
    });
  });