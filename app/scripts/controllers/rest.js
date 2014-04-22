'use strict';

angular.module('app')
  .controller('RestDataCtrl', function ($scope, settings, RestTimeSeriesDataModel, RestTopNDataModel) {
    var widgetDefs = [
      {
        name: 'Line Chart Minutes',
        directive: 'wt-line-chart',
        dataAttrName: 'chart',
        dataModelType: RestTimeSeriesDataModel,
        dataModelOptions: {
          params: {
            bucket: 'MINUTES'
          }
        },
        style: {
          width: '50%'
        }
      },
      {
        name: 'Line Chart Hours',
        directive: 'wt-line-chart',
        dataAttrName: 'chart',
        dataModelType: RestTimeSeriesDataModel,
        dataModelOptions: {
          params: {
            bucket: 'HOURS'
          }
        },
        style: {
          width: '50%'
        }
      },
      {
        name: 'Line Chart',
        directive: 'wt-historical-chart',
        dataAttrName: 'chart',
        dataModelType: RestTimeSeriesDataModel,
        dataModelOptions: {
        },
        style: {
          width: '50%'
        }
      },
      {
        name: 'Countries',
        directive: 'wt-top-n',
        dataAttrName: 'data',
        dataModelType: RestTopNDataModel,
        dataModelOptions: {
          dimension: 'geoip_country_name',
          limit: 20
        },
        style: {
          width: '33%'
        }
      },
      {
        name: 'Cities',
        directive: 'wt-top-n',
        dataAttrName: 'data',
        dataModelType: RestTopNDataModel,
        dataModelOptions: {
          dimension: 'geoip_city_name',
          limit: 20
        },
        style: {
          width: '33%'
        }
      },
      {
        name: 'Browsers',
        directive: 'wt-top-n',
        dataAttrName: 'data',
        dataModelType: RestTopNDataModel,
        dataModelOptions: {
          dimension: 'agentinfo_name',
          limit: 20
        },
        style: {
          width: '33%'
        }
      }
    ];

    var defaultWidgets = [
      {
        name: 'Line Chart',
        title: 'Visits',
        dataModelOptions: {
          metric: 'count'
        }
      },
      {
        name: 'Line Chart',
        title: 'Bandwidth',
        dataModelOptions: {
          metric: 'bandwidth'
        }
      },
      {
        name: 'Countries',
        title: 'Countries'
      },
      {
        name: 'Cities',
        title: 'Cities'
      },
      {
        name: 'Browsers',
        title: 'Browsers'
      }
    ];

    $scope.dashboardOptions = {
      widgetButtons: true,
      widgetDefinitions: widgetDefs,
      defaultWidgets: defaultWidgets
    };
  });