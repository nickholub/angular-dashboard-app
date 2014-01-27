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
          defaultTopic: 'app.visualdata.piValue_{"type":"simple"}' //TODO
        },
        style: {
          width: '30%'
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
          defaultTopic: 'app.visualdata.percentage_{"type":"percentage"}' //TODO
        },
        style: {
          width: '30%'
        }
      },
      {
        name: 'Line Chart',
        directive: 'wt-line-chart',
        dataAttrName: 'chart',
        dataTypes: ['timeseries'],
        dataSourceType: TimeSeriesDataSource,
        dataSourceOptions: {
          defaultTopic: 'app.visualdata.chartValue_{"type":"timeseries","minValue":0,"maxValue":100}' //TODO
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
          defaultTopic: 'app.visualdata.topn_{"type":"topN","n":10}' //TODO
        }
      },
      {
        name: 'Gauge',
        directive: 'wt-gauge',
        dataAttrName: 'value',
        dataTypes: ['percentage', 'simple'],
        dataSourceType: WebSocketDataSource,
        dataSourceOptions: {
          defaultTopic: 'app.visualdata.percentage_{"type":"percentage"}' //TODO
        },
        style: {
          width: '250px'
        }
      },
      {
        name: 'Topics',
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
      copy('Value'),
      copy('Value', {
        dataSourceOptions: {
          defaultTopic: 'app.visualdata.percentage_{"type":"percentage"}'
        }
      }),
      copy('Progressbar'),
      copy('Line Chart'),
      copy('Line Chart', {
        dataSourceOptions: {
          defaultTopic: 'app.visualdata.chartValue2_{"type":"timeseries","minValue":0,"maxValue":100}' //TODO
        }
      }),
      copy('TopN'),
      copy('Gauge'),
      copy('Topics')
    ];

    console.log(defaultWidgets);

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
    $scope.prevTopic = function () {
      var index = $scope.topicDefs.indexOf($scope.topic);
      var prev = ($scope.topicDefs.length + index - 1) % $scope.topicDefs.length;
      $scope.topic = $scope.topicDefs[prev];
    };

    $scope.nextTopic = function () {
      var index = $scope.topicDefs.indexOf($scope.topic);
      var next = (index + 1) % $scope.topicDefs.length;
      $scope.topic = $scope.topicDefs[next];
    };

    $scope.selectTopic = function (topic) {
      $scope.topic = topic;
    };

    var callback = function (message) {
      $scope.topicData = JSON.stringify(message, null, ' ');
      $scope.$apply();
    };

    $scope.$watch('topic', function (newTopic, oldTopic) {
      if (oldTopic && callback) {
        webSocket.unsubscribe(oldTopic.topic, callback);
      }

      if (newTopic) {
        $scope.topicData = 'Loading...';
        $scope.topicSchema = JSON.stringify(newTopic.schema, null, ' ');
        webSocket.subscribe(newTopic.topic, callback, $scope);
        //$scope.$emit('topic', newTopic); //TODO
        //$rootScope.$broadcast('topic', newTopic);
      }
    });

    $scope.topicDefs = [];

    $scope.mySelections = [];

    $scope.gridOptions = {
      data: 'topicDefs',
      selectedItems: $scope.mySelections,
      multiSelect: false,
      enableColumnResize: true,
      columnDefs: [
        { field: 'name', displayName: 'Topic', width: '70%' },
        { field: 'type', displayName: 'Type', width: '30%' }
      ]
    };

    webSocket.subscribe('_latestTopics', function (message) {
      var list = _.reject(message, function (topic) {
        return topic.indexOf('applications.') >= 0;
      });

      $scope.topicDefs = _.map(list, function (topic) {

        var schemaInd = topic.indexOf('_');
        var name = topic;
        var type = null;
        var schema = {};

        if (schemaInd > 0) {
          name = topic.substr(0, schemaInd);
          var schemaStr = topic.substr(schemaInd + 1);
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

      $scope.topicDefs = _.sortBy($scope.topicDefs, function (topic) {
        return topic.name;
      });

      if (message.length) {
        $scope.topic = $scope.topicDefs[0];
      }

      //$scope.mySelections = [$scope.topicDefs[0]];

      $scope.$apply();
    }, $scope);
    webSocket.send({ type: 'getLatestTopics' });

  })
  .controller('WidgetOptionsCtrl', function ($scope, webSocket, settings) {
    $scope.webSocketURL = settings.webSocketURL; //TODO

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

    if (widget && widget.dataSource) {
      // load available topics
      webSocket.subscribe('_latestTopics', function (message) {
        var list = _.reject(message, function (topic) {
          return topic.indexOf('applications.') >= 0;
        });

        var topics = _.map(list, function (topic) {
          var schemaInd = topic.indexOf('_');
          var name = topic;
          var type = null;
          var schema = {};

          if (schemaInd > 0) {
            name = topic.substr(0, schemaInd);
            var schemaStr = topic.substr(schemaInd + 1);
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

        if (widget.dataTypes) {
          $scope.dataTypes = widget.dataTypes.join(', '); //TODO use filter instead

          topics = _.reject(topics, function (topic) {
            return !topic.schema || !_.contains(widget.dataTypes, topic.schema.type);
          });
        }

        topics = _.sortBy(topics, function (topic) {
          return topic.name;
        });

        $scope.topics = topics;
        $scope.topic = _.findWhere($scope.topics, {topic: widget.dataSource.topic});

        //TODO unsubscribe webSocket.get(request).then(...);

        $scope.$apply();
      }, $scope);
      webSocket.send({ type: 'getLatestTopics' });

      $scope.$watch('topic', function (newTopic) {
        if (newTopic && (newTopic.topic !== widget.dataSource.topic)) {
          console.log(widget.dataSource);
          widget.dataSource.update(newTopic.topic);
        }
      });

      $scope.selectTopic = function (topic) {
        $scope.topic = topic;
      };
    }
  })
;