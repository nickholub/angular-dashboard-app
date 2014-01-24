'use strict';

function ValueModel(name, $scope, webSocket) {
  this.topic = null;

  var callback = function (message) {
    $scope[name] = message;
    $scope.$apply();
  };

  this.update = function (newTopic) {
    if (this.topic) {
      webSocket.unsubscribe(this.topic, callback);
    }
    this.topic = newTopic;
    webSocket.subscribe(this.topic, callback, $scope);
  };
}

//TODO
function ChartModel(name, $scope, webSocket) {
  this.topic = null;

  var max = 30;
  var data = [];

  var callback = function (value) {
    var now = Date.now();

    data.push({
      timestamp: now,
      value: value
    });

    if (data.length > 100) { //TODO
      data.shift();
    }

    $scope[name] = {
      data: data,
      max: max
    };

    $scope.$apply();
  };

  this.update = function (newTopic) {
    if (this.topic) {
      webSocket.unsubscribe(this.topic, callback);
    }

    this.topic = newTopic;
    data = [];

    webSocket.subscribe(this.topic, callback, $scope);
  };
}

function DataSource(model, topic) {
  this.model = model;
  this.topic = topic;

  if (topic) {
    this.model.update(topic);
  }

  this.update = function (topic) {
    this.topic = topic;
    this.model.update(topic);
  };
}

angular.module('app')
  .factory('WebSocketDataSource', function (WidgetDataSource, webSocket) {
    function WebSocketDataSource() {
      console.log('WebSocketDataSource constructor');
    }
    WebSocketDataSource.prototype = Object.create(WidgetDataSource.prototype);

    WebSocketDataSource.prototype.init = function () {
      this.topic = null;
      this.callback = null;
      this.update('app.visualdata.piValue');
    };

    WebSocketDataSource.prototype.update = function (newTopic) {
      console.log('_update');
      var that = this;

      if (this.topic && this.callback) {
        webSocket.unsubscribe(this.topic, this.callback);
      }

      this.callback = function (message) {
        //console.log('_callback ' + that.topic);
        that.updateScope(message);
        that.widgetScope.$apply();
      };

      this.topic = newTopic;
      webSocket.subscribe(this.topic, this.callback, this.widgetScope);
    };

    WebSocketDataSource.prototype.destroy = function () {
      WidgetDataSource.prototype.destroy.call(this);

      console.log('_WebSocketDataSource destroy');

      if (this.topic && this.callback) {
        webSocket.unsubscribe(this.topic, this.callback);
      }
    };

    return WebSocketDataSource;
  })
  .factory('RandomValueDataSource', function (WidgetDataSource, $interval) {
    function RandomValueDataSource() {
      console.log('RandomValueDataSource constructor');
    }
    RandomValueDataSource.prototype = Object.create(WidgetDataSource.prototype);

    RandomValueDataSource.prototype.init = function () {
      var base = Math.floor(Math.random() * 10) * 10;

      this.updateScope(base);

      var that = this;

      this.intervalPromise = $interval(function () {
        var random = base + Math.random();
        //console.log(random);
        that.updateScope(random);
      }, 500);
    };

    RandomValueDataSource.prototype.destroy = function () {
      WidgetDataSource.prototype.destroy.call(this);
      console.log('_RandomValueDataSource destroy');
      $interval.cancel(this.intervalPromise);
    };

    return RandomValueDataSource;
  })
  .controller('ServerDataCtrl', function ($scope, webSocket, settings, RandomValueDataSource, WebSocketDataSource) {
    $scope.value1 = 'not defined';
    $scope.value2 = 'not defined';

    var widgetDefinitions = [
      {
        name: 'value1',
        directive: 'wt-scope-watch',
        dataAttrName: 'value',
        //ds: new WidgetDataSource(),
        //ds: new RandomValueDataSource(),
        dataSourceType: RandomValueDataSource,
        style: {
          width: '40%'
        }
      },
      {
        name: 'value2',
        directive: 'wt-scope-watch',
        dataAttrName: 'value',
        dataSourceType: WebSocketDataSource,
        style: {
          width: '40%'
        }
      },
      {
        name: 'chart1',
        directive: 'wt-line-chart',
        attrs: {
          chart: 'chart'
        },
        dataSource: new DataSource(
          new ChartModel('chart', $scope, webSocket),
          'app.visualdata.chartValue'
        ),
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
        name: 'wt-gauge',
        attrs: {
          value: 'gaugeValue'
        },
        dataSource: new DataSource(
          new ValueModel('gaugeValue', $scope, webSocket),
          'app.visualdata.chartValue'
        ),
        style: {
          width: '250px'
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

    $scope.chartValue = 0;
    var valueModel = new ValueModel('chartValue', $scope, webSocket);

    var chartModel = new ChartModel('chart', $scope, webSocket);

    var chartModel2 = new ChartModel('chart2', $scope, webSocket);
    chartModel2.update('app.visualdata.chartValue2');

    $scope.$on('topic', function (event, topic) {
      valueModel.update(topic);
      chartModel.update(topic);
    });
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