'use strict';

angular.module('app')
  .controller('RestDataCtrl', function ($scope, webSocket, Gateway, settings, RestTimeSeriesDataModel) {
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
      }
    ];

    var defaultWidgets = [
      {
        name: 'Line Chart Minutes',
        title: 'MongoDB Historical Data - Minutes'
      },
      {
        name: 'Line Chart Hours',
        title: 'MongoDB Historical Data - Hours'
      }
    ];

    $scope.dashboardOptions = {
      //useLocalStorage: true, //TODO enable by default
      widgetButtons: true,
      widgetDefinitions: widgetDefs,
      defaultWidgets: defaultWidgets,
      //optionsTemplateUrl: 'template/widgetOptions.html'
    };
  });