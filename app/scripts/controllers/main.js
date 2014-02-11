'use strict';

angular.module('app')
  .controller('MainCtrl', function ($scope, $interval, stackedAreaChartSampleData, pieChartSampleData) {
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
        name: 'wt-pie-chart',
        style: {
          width: '350px',
          height: '350px'
        },
        attrs: {
          data: 'pieChartData'
        }
      },
      {
        name: 'wt-top-n',
        attrs: {
          data: 'topTen'
        },
        style: {
          width: '40%'
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
        name: 'progressbar2', //TODO name
        template: '<div progressbar class="progress-striped" type="info" value="percentage">{{percentage}}%</div>',
        style: {
          width: '30%'
        }
      },
      {
        name: 'wt-line-chart',
        attrs: {
          chart: 'chart'
        },
        style: {
          width: '50%'
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

// top 10 (topN widget)
    $interval(function () {
      var topTen = _.map(_.range(1, 11), function (index) {
        return {
          name: 'item' + index,
          value: Math.floor(Math.random() * 100)
        };
      });
      $scope.topTen = topTen;
    }, 1000);

// percentage (gauge widget, progressbar widget)
    $scope.percentage = 5;
    $interval(function () {
      $scope.percentage = ($scope.percentage + 10) % 100;
    }, 1000);

// line chart
    var max = 30;
    var data = [];
    var chartValue = 50;

    function nextValue() {
      chartValue += Math.random() * 40 - 20;
      chartValue = chartValue < 0 ? 0 : chartValue > 100 ? 100 : chartValue;
      return chartValue;
    }

    var now = Date.now();
    for (var i = max - 1; i >= 0; i--) {
      data.push({
        timestamp: now - i * 1000,
        value: nextValue()
      });
    }
    $scope.chart = {
      data: data,
      max: max
    };

    $interval(function () {
      data.shift();
      data.push({
        timestamp: Date.now(),
        value: nextValue()
      });

      $scope.chart = {
        data: data,
        max: max
      };
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

    var pieChart = angular.copy(pieChartSampleData);

    $interval(function () { //TODO
      var a = pieChart[0];
      var b = pieChart[1];
      var sum = a.y + b.y;
      a.y = (a.y + 1) % sum;
      b.y = sum - a.y;
      $scope.pieChartData = angular.copy(pieChart);
    }, 500);

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