'use strict';

angular.module('app')
  .controller('MeteorCtrl', function ($scope, MeteorTimeSeriesDataModel, widgetDefs) {
    var defaultWidgets = [
      {
        name: 'Line Chart',
        dataModelType: MeteorTimeSeriesDataModel,
        dataModelOptions: {
          collection: 'timeseries'
        }
      }
    ];

    $scope.dashboardOptions = {
      widgetButtons: true,
      widgetDefinitions: widgetDefs,
      defaultWidgets: defaultWidgets,
      optionsTemplateUrl: 'template/widgetOptions.html'
    };
  });
