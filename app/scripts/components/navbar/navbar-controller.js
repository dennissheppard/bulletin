angular.module('bulletinApp.navbar', ['services.user'])
  .controller('NavbarCtrl', function($scope, $location, UserService){
    $scope.user = UserService;



    $scope.logout = function(){
      UserService.logout().then(function(){
        $location.path('/login');
      });
    };


  });