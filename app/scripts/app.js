'use strict';

angular.module('app', [
  'ngRoute',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.sortable'
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
