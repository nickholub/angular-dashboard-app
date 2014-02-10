'use strict';

angular.module('app')
  .controller('DiscoveryCtrl', function ($scope, $routeParams, webSocket, Gateway, settings,
                                         RandomValueDataModel, WebSocketDataModel, TimeSeriesDataModel,
                                         PieChartDataModel, notificationService) {
    var widgetDefinitions = [
      {
        name: 'Value',
        directive: 'wt-scope-watch',
        dataAttrName: 'value',
        attrs: {
          'value-class': 'alert-info'
        },
        dataTypes: ['percentage', 'simple'],
        dataModelType: WebSocketDataModel,
        dataModelOptions: {
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
        dataModelType: WebSocketDataModel,
        dataModelOptions: {
        }
      },
      {
        name: 'Line Chart',
        directive: 'wt-line-chart',
        dataAttrName: 'chart',
        dataTypes: ['timeseries'],
        dataModelType: TimeSeriesDataModel,
        dataModelOptions: {

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
        dataModelType: WebSocketDataModel,
        dataModelOptions: {
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
        dataModelType: PieChartDataModel,
        dataModelOptions: {
        }
      },
      {
        name: 'Gauge',
        directive: 'wt-gauge',
        dataAttrName: 'value',
        dataTypes: ['percentage', 'simple'],
        dataModelType: WebSocketDataModel,
        dataModelOptions: {
        },
        style: {
          width: '250px'
        }
      },
      {
        name: 'JSON',
        directive: 'wt-json',
        dataAttrName: 'value',
        dataModelType: WebSocketDataModel,
        dataModelOptions: {
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

      var appId;

      if ($routeParams.appId) {
        appId = $routeParams.appId;
      } else {
        appId = topics[0].appId;
      }

      var selTopic = _.findWhere(topics, { appId: appId });

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
            dataModelOptions: {
              topic: topic.topic
            }
          });
        } else if (type === 'topN') {
          addWidget('TopN', {
            title: 'Top N',
            dataModelOptions: {
              topic: topic.topic
            }
          });
        } else if (type === 'percentage') {
          if (!gaugeUsed) {
            addWidget('Gauge', {
              title: 'Gauge',
              dataModelOptions: {
                topic: topic.topic
              }
            });
            gaugeUsed = true;
          } else {
            addWidget('Progressbar', {
              title: 'Progressbar',
              dataModelOptions: {
                topic: topic.topic
              }
            });
          }
        } else if (type === 'piechart') {
          addWidget('Pie Chart', {
            title: 'Pie Chart',
            dataModelOptions: {
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

      if (widget.dataModel && widget.dataModelOptions && widget.dataModelOptions.topic) {
        topicsPromise.then(function (topics) {
          var selTopic = widget.dataModelOptions.topic;

          var topic = null;

          if (selTopic) {
            topic = _.find(topics, function (topic) {
              return topic.topic === selTopic;
            });
          } else {
            var defaultTopic = widget.dataModelOptions.defaultTopic;

            topic = _.find(topics, function (topic) {
              return topic.name.indexOf(defaultTopic) >= 0;
            });
          }

          if (topic) {
            widget.dataModel.update(topic.topic);
          }
        });
      }
    });
  });