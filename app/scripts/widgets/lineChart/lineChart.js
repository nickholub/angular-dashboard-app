'use strict';

angular.module('ui.dashboard.widgets')
  .directive('lineChart', function () {
    return {
      template: '<div></div>',
      scope: {
        chart: '='
      },
      replace: true,
      link: function postLink(scope, element) {
        var lineChart = new google.visualization.LineChart(element[0]);

        function draw(chart) {
          var data = chart.data;

          var table = new google.visualization.DataTable();
          table.addColumn('datetime');
          table.addColumn('number');
          table.addRows(data.length);

          var view = new google.visualization.DataView(table);

          for (var i = 0; i < data.length; i++) {
            var item = data[i];
            table.setCell(i, 0, new Date(item.timestamp));
            var value = parseFloat(item.value);
            table.setCell(i, 1, value);
          }

          var lastTimestamp;

          if (data.length) {
            var last = data[data.length - 1];
            lastTimestamp = last.timestamp;
          } else {
            lastTimestamp = Date.now();
          }

          var max = new Date(lastTimestamp);
          var min = new Date(lastTimestamp - (chart.max - 1) * 1000);

          var chartOptions = {
            legend: 'none',
            vAxis: { minValue: 0, maxValue: 100 },
            hAxis: { viewWindow: { min: min, max: max }},
            //chartArea: { top: 20, left: 30, height: 240 }
          };

          lineChart.draw(view, chartOptions);
        }

        scope.$watch('chart', function (chart) {
          if (chart && chart.data && chart.max) {
            draw(chart);
          }
        });
      }
    };
  });