'use strict';

angular.module('app')
  .controller('MeteorCtrl', function ($scope, MeteorDataModel, MeteorTimeSeriesDataModel, widgetDefs) {
    var defaultWidgets = [
      {
        name: 'Line Chart',
        title: 'Meteor MongoDB Historical Data',
        dataModelType: MeteorTimeSeriesDataModel,
        dataModelOptions: {
          collection: 'timeseries'
        }
      },
      {
        name: 'JSON',
        title: 'Players Collection Changes',
        dataModelType: MeteorDataModel,
        dataModelOptions: {
          collection: 'players'
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
