'use strict';

angular.module('app.service', ['app.websocket']);

angular.module('app.service')
  .factory('PieChartDataModel', function (WebSocketDataModel) {
    function PieChartDataModel() {
    }

    PieChartDataModel.prototype = Object.create(WebSocketDataModel.prototype);

    PieChartDataModel.prototype.init = function () {
      WebSocketDataModel.prototype.init.call(this);
      this.data = [];
    };

    PieChartDataModel.prototype.update = function (newTopic) {
      WebSocketDataModel.prototype.update.call(this, newTopic);
    };

    PieChartDataModel.prototype.updateScope = function (value) {
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

      WebSocketDataModel.prototype.updateScope.call(this, sectors);
    };

    return PieChartDataModel;
  })
  .factory('TimeSeriesDataModel', function (WebSocketDataModel) {
    function TimeSeriesDataModel() {
    }

    TimeSeriesDataModel.prototype = Object.create(WebSocketDataModel.prototype);

    TimeSeriesDataModel.prototype.init = function () {
      WebSocketDataModel.prototype.init.call(this);
    };

    TimeSeriesDataModel.prototype.update = function (newTopic) {
      WebSocketDataModel.prototype.update.call(this, newTopic);
      this.items = [];
    };

    TimeSeriesDataModel.prototype.updateScope = function (value) {
      value = _.isArray(value) ? value[0] : value;

      this.items.push({
        timestamp: parseInt(value.timestamp, 10), //TODO
        value: parseInt(value.value, 10) //TODO
      });

      if (this.items.length > 100) { //TODO
        this.items.shift();
      }

      var chart = {
        data: this.items,
        max: 30
      };

      WebSocketDataModel.prototype.updateScope.call(this, chart);
      this.data = [];
    };

    return TimeSeriesDataModel;
  })
  .factory('RestTimeSeriesDataModel', function (settings, WidgetDataModel, $http) {
    function RestTimeSeriesDataModel() {
    }

    RestTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    RestTimeSeriesDataModel.prototype.init = function () {
      WidgetDataModel.prototype.init.call(this);

      $http.get('/data').success(function (data) {
        var chart = {
          data: data,
          chartOptions: { vAxis: {} }
        };

        WidgetDataModel.prototype.updateScope.call(this, chart);
      }.bind(this));
    };

    return RestTimeSeriesDataModel;
  })
  .factory('MeteorTimeSeriesDataModel', function (settings, MeteorDdp, WidgetDataModel) {
    function MeteorTimeSeriesDataModel() {
      var ddp = new MeteorDdp(settings.meteorURL); //TODO
      this.ddp = ddp;

      var that = this;

      ddp.connect().done(function() {
        console.log('Meteor connected');
        that.update();
      });
    }

    MeteorTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    MeteorTimeSeriesDataModel.prototype.init = function () {
      WidgetDataModel.prototype.init.call(this);
    };

    //TODO
    MeteorTimeSeriesDataModel.prototype.update = function (collection) {
      this.items = [];
      collection = collection ? collection : this.dataModelOptions.collection;

      this.ddp.subscribe(collection); //TODO

      var that = this;

      this.ddp.watch(collection, function(doc, msg) {
        if (msg === 'added') {
          that.updateScope(doc);
          that.widgetScope.$apply();
        }
      });
    };

    MeteorTimeSeriesDataModel.prototype.updateScope = function (value) {
      if (value.hasOwnProperty('history')) {
        //console.log(_.pluck(value.history, 'timestamp'));
        this.items.push.apply(this.items, value.history);
      } else {
        this.items.push(value);
      }

      if (this.items.length > 100) { //TODO
        this.items.splice(0, this.items.length - 100);
      }

      var chart = {
        data: this.items,
        max: 30
      };

      WidgetDataModel.prototype.updateScope.call(this, chart);
      this.data = [];
    };

    return MeteorTimeSeriesDataModel;
  })
  .factory('MeteorDataModel', function (settings, MeteorDdp, WidgetDataModel) {
    function MeteorTimeSeriesDataModel() {
      var ddp = new MeteorDdp(settings.meteorURL); //TODO
      this.ddp = ddp;

      var that = this;

      ddp.connect().done(function() {
        console.log('Meteor connected');
        that.update();
      });
    }

    MeteorTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    MeteorTimeSeriesDataModel.prototype.init = function () {
      WidgetDataModel.prototype.init.call(this);
    };

    //TODO
    MeteorTimeSeriesDataModel.prototype.update = function (collection) {
      this.items = [];
      collection = collection ? collection : this.dataModelOptions.collection;

      this.ddp.subscribe(collection); //TODO get whole collection instead of 'added' events

      var that = this;

      this.ddp.watch(collection, function(value) {
        //console.log(value);
        that.updateScope(value);
        that.widgetScope.$apply();
      });
    };

    return MeteorTimeSeriesDataModel;
  })
  .factory('WebSocketDataModel', function (WidgetDataModel, webSocket) {
    function WebSocketDataModel() {
    }

    WebSocketDataModel.prototype = Object.create(WidgetDataModel.prototype);

    WebSocketDataModel.prototype.init = function () {
      this.topic = null;
      this.callback = null;
      if (this.dataModelOptions && this.dataModelOptions.defaultTopic) {
        this.update(this.dataModelOptions.defaultTopic);
      }
    };

    WebSocketDataModel.prototype.update = function (newTopic) {
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

    WebSocketDataModel.prototype.destroy = function () {
      WidgetDataModel.prototype.destroy.call(this);

      if (this.topic && this.callback) {
        webSocket.unsubscribe(this.topic, this.callback);
      }
    };

    return WebSocketDataModel;
  })
  .factory('RandomValueDataModel', function (WidgetDataModel, $interval) {
    function RandomValueDataModel() {
    }

    RandomValueDataModel.prototype = Object.create(WidgetDataModel.prototype);

    RandomValueDataModel.prototype.init = function () {
      var base = Math.floor(Math.random() * 10) * 10;

      this.updateScope(base);

      var that = this;

      this.intervalPromise = $interval(function () {
        var random = base + Math.random();
        that.updateScope(random);
      }, 500);
    };

    RandomValueDataModel.prototype.destroy = function () {
      WidgetDataModel.prototype.destroy.call(this);
      $interval.cancel(this.intervalPromise);
    };

    return RandomValueDataModel;
  });