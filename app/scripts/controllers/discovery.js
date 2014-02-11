'use strict';

angular.module('app')
  .controller('DiscoveryCtrl', function ($scope, $routeParams, webSocket, Gateway, settings,
                                         widgetDefs, notificationService) {

    $scope.dashboardOptions = {
      useLocalStorage: false, //TODO enable by default
      widgetButtons: true,
      widgetDefinitions: widgetDefs,
      optionsTemplateUrl: 'template/widgetOptions.html'
    };

    Gateway.getTopics().then(function (topics) {
      if (!topics.length) { //TODO
        return;
      }

      topics = _.sortBy(topics, function (topic) {
        return (-topic.appStartedTime);
      });

      var appId;

      if ($routeParams.appId) {
        appId = $routeParams.appId;
      } else {
        appId = topics[0].appId;
      }

      var selTopic = _.findWhere(topics, { appId: appId });

      var appTopics = _.where(topics, { appId: appId });

      var widgets = [];
      function addWidget(widget) {
        widgets.push(widget);
      }

      var gaugeUsed = false;

      _.each(appTopics, function (topic) {
        var type = topic.schema.type;

        if (type === 'timeseries') {
          addWidget({
            name: 'Line Chart',
            title: 'Line Chart',
            dataModelOptions: {
              topic: topic.topic
            }
          });
        } else if (type === 'topN') {
          addWidget({
            name: 'TopN',
            title: 'Top N',
            dataModelOptions: {
              topic: topic.topic
            }
          });
        } else if (type === 'percentage') {
          if (!gaugeUsed) {
            addWidget({
              name: 'Gauge',
              title: 'Gauge',
              dataModelOptions: {
                topic: topic.topic
              }
            });
            gaugeUsed = true;
          } else {
            addWidget({
              name: 'Progressbar',
              title: 'Progressbar',
              dataModelOptions: {
                topic: topic.topic
              }
            });
          }
        } else if (type === 'piechart') {
          addWidget({
            name: 'Pie Chart',
            title: 'Pie Chart',
            dataModelOptions: {
              topic: topic.topic
            }
          });
        }
      });

      $scope.dashboardOptions.loadWidgets(widgets);

      notificationService.notify({
        title: 'Dashboard Loaded',
        text: 'Dashboard for application {name} ({id}) has been loaded.'
          .replace('{name}', selTopic.appName)
          .replace('{id}', selTopic.appId),
        type: 'success',
        delay: 5000,
        icon: false,
        history: false
      });
    });

    // initialize widgets with default topics
    var topicsPromise = Gateway.getTopics();

    $scope.$on('widgetAdded', function (event, widget) {
      event.stopPropagation();

      if (widget.dataModel && widget.dataModelOptions && widget.dataModelOptions.topic) {
        topicsPromise.then(function (topics) {
          var selTopic = widget.dataModelOptions.topic;

          var topic = null;

          if (selTopic) {
            topic = _.find(topics, function (topic) {
              return topic.topic === selTopic;
            });
          } else {
            var defaultTopic = widget.dataModelOptions.defaultTopic;

            topic = _.find(topics, function (topic) {
              return topic.name.indexOf(defaultTopic) >= 0;
            });
          }

          if (topic) {
            widget.dataModel.update(topic.topic);
          }
        });
      }
    });
  });