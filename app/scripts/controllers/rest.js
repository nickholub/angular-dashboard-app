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
          width: '100%'
        }
      },
      {
        name: 'Countries',
        directive: 'wt-top-n',
        dataAttrName: 'data',
        dataModelType: RestTopNDataModel,
        style: {
          width: '30%'
        }
      }
    ];

    var defaultWidgets = [
      {
        name: 'Line Chart',
        title: 'Visits'
      },
      {
        name: 'Countries',
        title: 'Countries'
      }
    ];

    $scope.dashboardOptions = {
      widgetButtons: true,
      widgetDefinitions: widgetDefs,
      defaultWidgets: defaultWidgets
    };
  });