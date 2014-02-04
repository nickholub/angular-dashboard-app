'use strict';

angular.module('app')
  .controller('DiscoveryCtrl', function ($scope, webSocket, Gateway, settings,
                                         RandomValueDataSource, WebSocketDataSource, TimeSeriesDataSource,
                                         PieChartDataSource, notificationService) {
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
        }
      },
      {
        name: 'Line Chart',
        directive: 'wt-line-chart',
        dataAttrName: 'chart',
        dataTypes: ['timeseries'],
        dataSourceType: TimeSeriesDataSource,
        dataSourceOptions: {

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
        dataTypes: ['piechart'],
        dataSourceType: PieChartDataSource,
        dataSourceOptions: {
        }
      },
      {
        name: 'Gauge',
        directive: 'wt-gauge',
        dataAttrName: 'value',
        dataTypes: ['percentage', 'simple'],
        dataSourceType: WebSocketDataSource,
        dataSourceOptions: {
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

    $scope.dashboardOptions = {
      useLocalStorage: false, //TODO enable by default
      widgetButtons: true,
      widgetDefinitions: widgetDefinitions,
      //defaultWidgets: defaultWidgets,
      optionsTemplateUrl: 'template/widgetOptions.html'
    };

    Gateway.getTopics().then(function (topics) {
      if (!topics.length) { //TODO
        return;
      }

      topics = _.sortBy(topics, function (topic) {
        return (-topic.appStartedTime);
      });

      var selTopic = topics[0];

      var appId = selTopic.appId; //TODO
      var appTopics = _.where(topics, { appId: appId });

      var widgets = [];
      function addWidget(name, widget) {
        widgets.push(copy(name, widget));
      }
      var gaugeUsed = false;

      _.each(appTopics, function (topic) {
        var type = topic.schema.type;

        if (type === 'timeseries') {
          addWidget('Line Chart', {
            title: 'Line Chart',
            dataSourceOptions: {
              topic: topic.topic
            }
          });
        } else if (type === 'topN') {
          addWidget('TopN', {
            title: 'Top N',
            dataSourceOptions: {
              topic: topic.topic
            }
          });
        } else if (type === 'percentage') {
          if (!gaugeUsed) {
            addWidget('Gauge', {
              title: 'Gauge',
              dataSourceOptions: {
                topic: topic.topic
              }
            });
            gaugeUsed = true;
          } else {
            addWidget('Progressbar', {
              title: 'Progressbar',
              dataSourceOptions: {
                topic: topic.topic
              }
            });
          }
        } else if (type === 'piechart') {
          addWidget('Pie Chart', {
            title: 'Pie Chart',
            dataSourceOptions: {
              topic: topic.topic
            }
          });
        }
      });

      $scope.dashboardOptions.loadWidgets(widgets);

      notificationService.notify({
        title: 'Dashboard Loaded',
        text: 'Dashboard for application {name} ({id}) has been loaded.'
          .replace('{name}', selTopic.appName)
          .replace('{id}', selTopic.appId),
        type: 'success',
        delay: 5000,
        icon: false,
        history: false
      });
    });

    // initialize widgets with default topics
    var topicsPromise = Gateway.getTopics();

    $scope.$on('widgetAdded', function (event, widget) {
      event.stopPropagation();

      if (widget.dataSource && widget.dataSourceOptions && widget.dataSourceOptions.topic) {
        topicsPromise.then(function (topics) {
          var selTopic = widget.dataSourceOptions.topic;

          var topic = null;

          if (selTopic) {
            topic = _.find(topics, function (topic) {
              return topic.topic === selTopic;
            });
          } else {
            var defaultTopic = widget.dataSourceOptions.defaultTopic;

            topic = _.find(topics, function (topic) {
              return topic.name.indexOf(defaultTopic) >= 0;
            });
          }

          if (topic) {
            widget.dataSource.update(topic.topic);
          }
        });
      }
    });
  });