'use strict';

angular.module('ui.dashboard.widgets', ['ngGrid']);

angular.module('app', [
  'app.service',
  'ngRoute',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.dashboard',
  'nvd3ChartDirectives',
  'ui.dashboard.widgets'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });