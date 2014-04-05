'use strict';

angular.module('app')
  .controller('RestDataCtrl', function ($scope, webSocket, Gateway, settings, RestTimeSeriesDataModel) {
    var widgetDefs = [
      {
        name: 'Line Chart',
        directive: 'wt-line-chart',
        dataAttrName: 'chart',
        dataModelType: RestTimeSeriesDataModel,
        style: {
          width: '50%'
        }
      }
    ];

    var defaultWidgets = [
      {
        name: 'Line Chart',
        title: 'MongoDB Historical Data'
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