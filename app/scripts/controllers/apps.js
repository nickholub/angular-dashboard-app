'use strict';

angular.module('app')
  .controller('AppsCtrl', function ($scope, Gateway) {
    $scope.showLoading = true;

    var topicsPromise = Gateway.getTopics();

    topicsPromise.then(function (topics) {
      var appIdMap = {};

      _.each(topics, function (topic) {
        var appId = topic.appId;

        if (appIdMap.hasOwnProperty(appId)) {
          var app = appIdMap[appId];
          app.topicCount++;
        } else {
          var newApp = {
            id: appId,
            name: topic.appName,
            startedTime: topic.appStartedTime,
            topicCount: 1
          };
          appIdMap[appId] = newApp;
        }
      });

      $scope.apps = _.sortBy(_.values(appIdMap), function (app) {
        return (-app.startedTime);
      });
      $scope.showLoading = false;
    }, function () {
      $scope.showLoading = false;
    });

    var linkTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text><a href="#/apps/{{COL_FIELD}}">{{COL_FIELD}}</a></span></div>';

    $scope.gridOptions = {
      data: 'apps',
      enableRowSelection: false,
      enableColumnResize: true,
      showFilter: true,
      columnDefs: [
        { field: 'id', displayName: 'Id', cellTemplate: linkTemplate, width: 250 },
        { field: 'name', displayName: 'Name' },
        { field: 'startedTime', displayName: 'Start Time', cellFilter: 'date:\'yyyy-MM-dd HH:mm:ss\'', width: 200 },
        { field: 'topicCount', displayName: 'Topic Count', width: 150 }
      ]
    };
  });