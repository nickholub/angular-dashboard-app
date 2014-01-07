'use strict';

angular.module('app', [
  'ngRoute',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.dashboard'
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