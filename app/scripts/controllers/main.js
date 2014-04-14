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
      // {
      //   name: 'wt-line-chart',
      //   dataAttrName: 'chart',
      //   dataModelType: RandomTimeSeriesDataModel,
      //   style: {
      //     width: '50%'
      //   }
      // },
      {
        name: 'wt-bar-chart',
        dataModelType: RandomTimeSeriesDataModel,
        dataAttrName: 'data',
        template: '<nvd3-multi-bar-chart ' +
            'data="exampleData" ' +
            'id="exampleId" ' +
            'xAxisTickFormat="xAxisTickFormatFunction()" ' +
            'showXAxis="true" ' +
            'reduceXTicks="true" ' +
            'showYAxis="true" ' +
            'height="600" ' +
            '>' +
          '<svg></svg> ' +
          '</nvd3-multi-bar-chart>',
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

    $scope.exampleData = [
      {
        "key": "Series 1",
        "values": [ [ 1025409600000 , 0] , [ 1028088000000 , -6.3382185140371] , [ 1030766400000 , -5.9507873460847] , [ 1033358400000 , -11.569146943813] , [ 1036040400000 , -5.4767332317425] , [ 1038632400000 , 0.50794682203014] , [ 1041310800000 , -5.5310285460542] , [ 1043989200000 , -5.7838296963382] , [ 1046408400000 , -7.3249341615649] , [ 1049086800000 , -6.7078630712489] , [ 1051675200000 , 0.44227126150934] , [ 1054353600000 , 7.2481659343222] , [ 1056945600000 , 9.2512381306992] ]
      },
      {
        "key": "Series 2",
        "values": [ [ 1025409600000 , 0] , [ 1028088000000 , 0] , [ 1030766400000 , 0] , [ 1033358400000 , 0] , [ 1036040400000 , 0] , [ 1038632400000 , 0] , [ 1041310800000 , 0] , [ 1043989200000 , 0] , [ 1046408400000 , 0] , [ 1049086800000 , 0] , [ 1051675200000 , 0] , [ 1054353600000 , 0] , [ 1056945600000 , 0] , [ 1059624000000 , 0] , [ 1062302400000 , 0] , [ 1064894400000 , 0] , [ 1067576400000 , 0] , [ 1070168400000 , 0] , [ 1072846800000 , 0] , [ 1075525200000 , -0.049184266875945] ]
      },
      {
        "key": "Series 3",
        "values": [ [ 1025409600000 , 0] , [ 1028088000000 , -6.3382185140371] , [ 1030766400000 , -5.9507873460847] , [ 1033358400000 , -11.569146943813] , [ 1036040400000 , -5.4767332317425] , [ 1038632400000 , 0.50794682203014] , [ 1041310800000 , -5.5310285460542] , [ 1043989200000 , -5.7838296963382] , [ 1046408400000 , -7.3249341615649] , [ 1049086800000 , -6.7078630712489] , [ 1051675200000 , 0.44227126150934] , [ 1054353600000 , 7.2481659343222] , [ 1056945600000 , 9.2512381306992] ]
      },
      {
        "key": "Series 4",
        "values": [ [ 1025409600000 , -7.0674410638835] , [ 1028088000000 , -14.663359292964] , [ 1030766400000 , -14.104393060540] , [ 1033358400000 , -23.114477037218] , [ 1036040400000 , -16.774256687841] , [ 1038632400000 , -11.902028464000] , [ 1041310800000 , -16.883038668422] , [ 1043989200000 , -19.104223676831] , [ 1046408400000 , -20.420523282736] , [ 1049086800000 , -19.660555051587] , [ 1051675200000 , -13.106911231646] , [ 1054353600000 , -8.2448460302143] , [ 1056945600000 , -7.0313058730976] ]
      }
    ];

    $scope.xAxisTickFormatFunction = function(){
      return function(d){
        return d3.time.format('%b')(new Date(d));
      }
    }

    $interval(function() {
      $scope.exampleData = $scope.exampleData.map(function(series) {
        series.values.pop();
        return series;
      });
    }, 1000);

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