'use strict';

angular.module('app')
  .controller('MeteorCtrl', function ($scope, MeteorDataModel, MeteorTimeSeriesDataModel) {
    var widgetDefs = [
      {
        name: 'Line Chart',
        directive: 'wt-line-chart',
        dataAttrName: 'chart',
        dataModelType: MeteorTimeSeriesDataModel,
        dataModelOptions: {
          collection: 'history'
        },
        style: {
          width: '50%'
        }
      },
      {
        name: 'JSON',
        directive: 'wt-json',
        dataAttrName: 'value',
        dataModelType: MeteorDataModel,
        dataModelOptions: {
          collection: 'history'
        }
      }
    ];

    var defaultWidgets = [
      {
        name: 'Line Chart',
        title: 'Meteor MongoDB Historical Data'
      },
      {
        name: 'JSON',
        title: 'Collection Changes'
      }
    ];

    $scope.dashboardOptions = {
      widgetButtons: true,
      widgetDefinitions: widgetDefs,
      defaultWidgets: defaultWidgets,
      optionsTemplateUrl: 'template/widgetOptions.html'
    };
  });
