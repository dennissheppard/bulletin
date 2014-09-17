'use strict';

describe('Controller: Login', function () {

  // load the controller's module
  beforeEach(module('bulletinApp'));

  var LoginCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });


  }));
  /*
  * 1. If username is blank, an error should display inline
   2. If password is blank, an error should display inline
   3. If the username isn't recognized, an error should display and offer user to register as that user
   4. If the password isn't recognized, an error should display inline
   5. If the username and password combination is recognized, the user should be able to login
  * */

  it('should show an error if the username or password is blank', function () {
    scope.user.username = '';
    scope.user.password = 'test';
    scope.login();
    expect(scope.user.usernameError).toBe('Empty username');
    scope.user.username = 'test';
    scope.user.password = '';
    scope.login();
    expect(scope.user.passwordError).toBe('Empty password');
  });
  it('should show an error if the password is invalid', function(){
    var response = [];
    scope.validateLogin(response);
    expect(scope.user.loginError).toBeDefined();
  });
  it('should allow valid logins to login', function(){
    var response = [{
      'user': 'test',
      'password': 'valid'
    }];
    scope.validateLogin(response);
    expect(scope.user.isLoggedIn).toBeTruthy();
  });
});
