'use strict';

angular
  .module('bulletinApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'bulletinApp.login',
    'bulletinApp.navbar',
    'bulletinApp.home',
    'services.user',
    'services.loader',
    'services.message'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/home'
      })
      .when('/login',{
        templateUrl: 'scripts/components/login/login.tpl.html',
        controller: 'LoginCtrl'
      })
      .when('/home',{
        templateUrl: 'scripts/components/home/home.tpl.html',
        controller: 'HomeCtrl'
      })
      .otherwise({
        redirectTo: '/home'
      });
  })/*/
  .controller('bulletin', function($scope, $location, UserService){
    $scope.user = UserService;

  });*/
