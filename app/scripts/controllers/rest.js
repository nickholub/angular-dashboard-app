'use strict';

angular.module('app')
  .controller('RestDataCtrl', function ($scope, settings, RestTimeSeriesDataModel, RestTopNDataModel) {
    var widgetDefs = [
      {
        name: 'Line Chart Visits',
        directive: 'wt-historical-chart',
        dataAttrName: 'chart',
        dataModelType: RestTimeSeriesDataModel,
        dataModelOptions: {
          metric: 'count'
        },
        style: {
          width: '50%'
        }
      },
      {
        name: 'Line Chart Bandwidth',
        directive: 'wt-historical-chart',
        dataAttrName: 'chart',
        dataModelType: RestTimeSeriesDataModel,
        dataModelOptions: {
          metric: 'bandwidth'
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
        name: 'Line Chart Visits',
        title: 'Visits'
      },
      {
        name: 'Line Chart Bandwidth',
        title: 'Bandwidth'
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