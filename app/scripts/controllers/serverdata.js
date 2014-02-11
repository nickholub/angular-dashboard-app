'use strict';

angular.module('app')
  .controller('ServerDataCtrl', function ($scope, webSocket, Gateway, settings, widgetDefs) {
    var defaultWidgets = [
      {
        name: 'Value',
        title: 'Value 1'
      },
      {
        name: 'Value',
        title: 'Value 2',
        dataModelOptions: {
          defaultTopic: settings.topic.visualdata.percentage
        }
      },
      {
        name: 'Progressbar',
        title: 'Progressbar'
      },
      {
        name: 'Line Chart',
        title: 'Line Chart 1'
      },
      {
        name: 'Line Chart',
        title: 'Line Chart 2',
        dataModelOptions: {
          defaultTopic: settings.topic.visualdata.chartValue2
        }
      },
      {
        name: 'TopN',
        title: 'Top N'
      },
      {
        name: 'Pie Chart',
        title: 'Pie Chart'
      },
      {
        name: 'JSON',
        title: 'JSON'
      },
      {
        name: 'WebSocket Debugger',
        title: 'WebSocket Debugger'
      }
    ];

    $scope.dashboardOptions = {
      //useLocalStorage: true, //TODO enable by default
      widgetButtons: true,
      widgetDefinitions: widgetDefs,
      defaultWidgets: defaultWidgets,
      optionsTemplateUrl: 'template/widgetOptions.html'
    };

    // initialize widgets with default topics
    var topicsPromise = Gateway.getTopics();

    $scope.$on('widgetAdded', function (event, widget) {
      event.stopPropagation();

      if (widget.dataModel && widget.dataModelOptions && widget.dataModelOptions.defaultTopic) {
        topicsPromise.then(function (topics) {
          var defaultTopic = widget.dataModelOptions.defaultTopic;

          var topic = _.find(topics, function (topic) {
            return topic.name.indexOf(defaultTopic) >= 0;
          });

          if (topic) {
            widget.dataModel.update(topic.topic);
          }
        });
      }
    });
  });