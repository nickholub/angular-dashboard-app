'use strict';

angular.module('ui.dashboard.widgets', ['ngGrid']);

angular.module('app', [
    'app.service',
    'app.websocket',
    'ngRoute',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.dashboard',
    'nvd3ChartDirectives',
    'ui.dashboard.widgets'
  ])
  .constant('settings', window.settings)
  .config(function ($routeProvider, webSocketProvider, settings) {
    if (settings) {
      webSocketProvider.setWebSocketURL(settings.webSocketURL);
    }

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/serverdata', {
        templateUrl: 'views/main.html',
        controller: 'ServerDataCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    // Use Bootstrap 3 theme in PNotify jQuery plugin
    jQuery.pnotify.defaults.styling = 'bootstrap3';
  });