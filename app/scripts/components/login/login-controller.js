/**
 * Created by dsheppard on 5/27/14.
 */
'use strict';

angular.module('bulletinApp.login', ['services.user'])
  .controller('LoginCtrl', function($scope, $q, $location, UserService, LoaderService){
    $scope.user = {};
    $scope.user = UserService;

    $scope.login = function(){

      LoaderService.show();
      UserService.login($scope.user.username, $scope.user.password, $scope.user.keepLogin).then(function(response){
        LoaderService.hide();
        if($scope.user.isLoggedIn){
          $location.path('/home');
        }
      },
      function(error){
        $scope.user.passwordError = error;
        LoaderService.hide();
      });

    };

    $scope.modalShown = false;
    $scope.toggleModal = function(){
      delete $scope.user.newUsername;
      delete $scope.user.password;
      delete $scope.user.registerMessage;
      $scope.modalShown = !$scope.modalShown;
    };

    $scope.register = function(){
      if(!$scope.user.newUsername){
        return;
      }
      LoaderService.show();
      UserService.register($scope.user.newUsername, $scope.user.newPassword)
        .then(function(response){
          $scope.toggleModal();
          LoaderService.hide();
          if($scope.user.isLoggedIn){
            $location.path('/home');
          }
      },
      function(error){
        $scope.user.passwordError = error;
        LoaderService.hide();
      });

      $scope.toggleModal();
    };

    $scope.checkUsernameAvailability = function(){
      if(!$scope.user.newUsername){
        return;
      }
      LoaderService.show();
      UserService.isAvailable($scope.user.newUsername).then(function(isAvailable){
        LoaderService.hide();
        if(!isAvailable){
          $scope.user.registerMessage = 'Username taken, sorry!';
        } else{
          $scope.user.registerMessage = 'Username available!';
        }
      },
      function(error){
        $scope.user.registerMessage = error;
        LoaderService.hide();
      });
    };

  });