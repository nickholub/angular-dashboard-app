'use strict';

angular.module('app.service')
  .factory('widgetDefs', function (settings, WebSocketDataModel, TimeSeriesDataModel, PieChartDataModel) {
    return [
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
        dataModelType: WebSocketDataModel,
        dataModelOptions: {
          defaultTopic: settings.topic.visualdata.progress
        }
      },
      {
        name: 'Line Chart',
        directive: 'wt-line-chart',
        dataAttrName: 'chart',
        dataTypes: ['timeseries'],
        dataModelType: TimeSeriesDataModel,
        dataModelOptions: {
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
        dataModelType: WebSocketDataModel,
        dataModelOptions: {
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
        dataTypes: ['piechart'],
        dataModelType: PieChartDataModel,
        dataModelOptions: {
          defaultTopic: settings.topic.visualdata.pieChart
        }
      },
      {
        name: 'Gauge',
        directive: 'wt-gauge',
        dataAttrName: 'value',
        dataTypes: ['percentage', 'simple'],
        dataModelType: WebSocketDataModel,
        dataModelOptions: {
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
        dataModelType: WebSocketDataModel,
        dataModelOptions: {
          defaultTopic: settings.topic.visualdata.topn
        }
      },
      {
        name: 'WebSocket Debugger',
        templateUrl: 'template/topics.html'
      }
    ];
  });