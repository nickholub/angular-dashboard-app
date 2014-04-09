'use strict';

angular.module('app')
  .controller('MainCtrl', function ($scope, $interval, stackedAreaChartSampleData, pieChartSampleData, RandomTimeSeriesDataModel, RandomTopNDataModel) {
    var widgetDefinitions = [
      {
        name: 'wt-time',
        style: {
          width: '33%'
        }
      },
      {
        name: 'wt-random',
        style: {
          width: '33%'
        }
      },
      {
        name: 'wt-scope-watch',
        attrs: {
          value: 'randomValue'
        },
        style: {
          width: '34%'
        }
      },
      {
        name: 'wt-line-chart',
        dataAttrName: 'chart',
        dataModelType: RandomTimeSeriesDataModel,
        style: {
          width: '50%'
        }
      },
      {
        name: 'wt-gauge',
        attrs: {
          value: 'percentage'
        },
        style: {
          width: '250px'
        }
      },
      {
        name: 'wt-top-n',
        dataAttrName: 'data',
        dataModelType: RandomTopNDataModel,
        style: {
          width: '30%'
        }
      },
      {
        name: 'progressbar',
        attrs: {
          class: 'progress-striped',
          type: 'success',
          value: 'percentage'
        },
        style: {
          width: '30%'
        }
      },
      {
        name: 'progressbar2',
        template: '<div progressbar class="progress-striped" type="info" value="percentage">{{percentage}}%</div>',
        style: {
          width: '30%'
        }
      },
      {
        name: 'nvd3-stacked-area-chart',
        attrs: {
          data: 'stackedAreaChartData',
          height: '400',
          showXAxis: 'true',
          showYAxis: 'true',
          xAxisTickFormat: 'xAxisTickFormat()'
        },
        style: {
          width: '50%'
        }
      },
      {
        name: 'URLtemplate',
        templateUrl: 'template/percentage.html'
      },
      {
        name: 'wt-pie-chart',
        style: {
          width: '350px',
          height: '350px'
        },
        attrs: {
          data: 'pieChartData'
        }
      }
    ];


    var defaultWidgets = _.map(widgetDefinitions, function (widgetDef) {
      return {
        name: widgetDef.name
      };
    });

    $scope.dashboardOptions = {
      widgetButtons: true,
      widgetDefinitions: widgetDefinitions,
      defaultWidgets: defaultWidgets
    };

// random scope value (scope-watch widget)
    $interval(function () {
      $scope.randomValue = Math.random();
    }, 500);

// percentage (gauge widget, progressbar widget)
    $scope.percentage = 5;
    $interval(function () {
      $scope.percentage = ($scope.percentage + 10) % 100;
    }, 1000);

    // nvd3-stacked-area-chart
    $scope.stackedAreaChartData = stackedAreaChartSampleData;

    $scope.xAxisTickFormat = function () {
      return function (d) {
        return d3.time.format('%x')(new Date(d));
      };
    };

    // pie chart
    $scope.pieChartData = pieChartSampleData;

    /*
     var pieChart = angular.copy(pieChartSampleData);

     $interval(function () { //TODO
     var a = pieChart[0];
     var b = pieChart[1];
     var sum = a.y + b.y;
     a.y = (a.y + 1) % sum;
     b.y = sum - a.y;
     $scope.pieChartData = angular.copy(pieChart);
     }, 500);
     */

    // external controls
    $scope.addWidget = function (directive) {
      $scope.dashboardOptions.addWidget({
        name: directive
      });
    };

    $scope.addWidgetScopeWatch = function () {
      $scope.dashboardOptions.addWidget({
        name: 'scope-watch',
        attrs: {
          value: 'randomValue'
        }
      });
    };
  });