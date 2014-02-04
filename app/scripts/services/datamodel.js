'use strict';

angular.module('app.service')
  .factory('PieChartDataSource', function (WebSocketDataSource) {
    function PieChartDataSource() {
    }

    PieChartDataSource.prototype = Object.create(WebSocketDataSource.prototype);

    PieChartDataSource.prototype.init = function () {
      WebSocketDataSource.prototype.init.call(this);
      this.data = [];
    };

    PieChartDataSource.prototype.update = function (newTopic) {
      WebSocketDataSource.prototype.update.call(this, newTopic);
    };

    PieChartDataSource.prototype.updateScope = function (value) {
      var sum = _.reduce(value, function (memo, item) {
        return memo + parseFloat(item.value);
      }, 0);

      var sectors = _.map(value, function (item) {
        return {
          key: item.label,
          y: item.value / sum
        };
      });

      sectors = _.sortBy(sectors, function (item) {
        return item.key;
      });

      WebSocketDataSource.prototype.updateScope.call(this, sectors);
    };

    return PieChartDataSource;
  })
  .factory('TimeSeriesDataSource', function (WebSocketDataSource) {
    function TimeSeriesDataSource() {
    }

    TimeSeriesDataSource.prototype = Object.create(WebSocketDataSource.prototype);

    TimeSeriesDataSource.prototype.init = function () {
      WebSocketDataSource.prototype.init.call(this);
    };

    TimeSeriesDataSource.prototype.update = function (newTopic) {
      WebSocketDataSource.prototype.update.call(this, newTopic);
      this.items = [];
    };

    TimeSeriesDataSource.prototype.updateScope = function (value) {
      value = _.isArray(value) ? value[0] : value;

      this.items.push({
        timestamp: parseInt(value.timestamp, 10), //TODO
        value: parseInt(value.value, 10) //TODO
      });

      if (this.items > 100) { //TODO
        this.items.shift();
      }

      var chart = {
        data: this.items,
        max: 30
      };

      WebSocketDataSource.prototype.updateScope.call(this, chart);
      this.data = [];
    };

    return TimeSeriesDataSource;
  })
  .factory('WebSocketDataSource', function (WidgetDataSource, webSocket) {
    function WebSocketDataSource() {
    }

    WebSocketDataSource.prototype = Object.create(WidgetDataSource.prototype);

    WebSocketDataSource.prototype.init = function () {
      this.topic = null;
      this.callback = null;
      if (this.dataSourceOptions && this.dataSourceOptions.defaultTopic) {
        this.update(this.dataSourceOptions.defaultTopic);
      }
    };

    WebSocketDataSource.prototype.update = function (newTopic) {
      var that = this;

      if (this.topic && this.callback) {
        webSocket.unsubscribe(this.topic, this.callback);
      }

      this.callback = function (message) {
        that.updateScope(message);
        that.widgetScope.$apply();
      };

      this.topic = newTopic;
      webSocket.subscribe(this.topic, this.callback, this.widgetScope);
    };

    WebSocketDataSource.prototype.destroy = function () {
      WidgetDataSource.prototype.destroy.call(this);

      if (this.topic && this.callback) {
        webSocket.unsubscribe(this.topic, this.callback);
      }
    };

    return WebSocketDataSource;
  })
  .factory('RandomValueDataSource', function (WidgetDataSource, $interval) {
    function RandomValueDataSource() {
    }

    RandomValueDataSource.prototype = Object.create(WidgetDataSource.prototype);

    RandomValueDataSource.prototype.init = function () {
      var base = Math.floor(Math.random() * 10) * 10;

      this.updateScope(base);

      var that = this;

      this.intervalPromise = $interval(function () {
        var random = base + Math.random();
        that.updateScope(random);
      }, 500);
    };

    RandomValueDataSource.prototype.destroy = function () {
      WidgetDataSource.prototype.destroy.call(this);
      $interval.cancel(this.intervalPromise);
    };

    return RandomValueDataSource;
  });