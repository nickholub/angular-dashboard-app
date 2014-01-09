'use strict';

angular.module('ui.dashboard.widgets', ['ngGrid']);

angular.module('app', [
  'ngRoute',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.dashboard',
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