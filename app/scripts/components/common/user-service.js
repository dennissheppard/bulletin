angular.module('services.user', [])
  .factory('UserService', function($http, $q, $cookies){
    var MONGO_URL = {
      baseUrl: 'https://api.mongolab.com/api/1/databases/bulletin/collections/',
      apiKey: '5odPlHB745xUKDuNUG-WxzC9JrszwB2X'
    };

    var userFactory = {};

    var setupLogin = function(data, isAutoLogin){
      if(data && data._id){
        userFactory.isLoggedIn = true;
        userFactory.loginError = '';
        userFactory.votingRecord = data.votingRecord;
        if(!isAutoLogin){
          userFactory.token = data.token || getToken();
          saveAuthCookie();
          saveToken();
        }
      } else{
        userFactory.isLoggedIn = false;
        delete userFactory.username;
        delete userFactory.token;
        delete userFactory.password;
        if(isAutoLogin){
          delete $cookies.bulletin;
          userFactory.loginError = 'Your session has expired, please login again.';
        } else{
          userFactory.loginError = 'The username or password is invalid.';
        }
      }
    };

    var saveToken = function(){
      var url = MONGO_URL.baseUrl + 'accounts?q={"user":"' + userFactory.username + '"}&apiKey=' + MONGO_URL.apiKey
      return $http({
        method: 'PUT',
        url: url,
        data: JSON.stringify( { "$set" : { "token" : userFactory.token } } )
      });
    };

    var getToken = function(){
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    };

    var saveAuthCookie = function(){
      var expireDate = new Date();
      expireDate.setTime(expireDate.getTime() + (1000*24*60*60*1000));
      var expires = this.keepLogin ? 'expires=' + expireDate.toGMTString() : '';
      var authenticationString = '{ "username": "' + userFactory.username + '", "token": "' + userFactory.token + '"}';
      $cookies.bulletin = authenticationString + '; expires=' + expireDate;
    };

    userFactory.login = function(username, password, keepLogin){
      this.keepLogin = keepLogin;
      return $http({
        method: 'GET',
        url: MONGO_URL.baseUrl + 'accounts?q={"user":"' + username + '","password":"' + password + '"}&apiKey=' + MONGO_URL.apiKey// + '&callback=JSON_CALLBACK'
      })
        .success(function(response){
          setupLogin(response[0]);
        })
        .error(function(error){

        });
    };

    userFactory.register = function(username, password){
      var deferred = $q.defer();

      var url = MONGO_URL.baseUrl + 'accounts?apiKey=' + MONGO_URL.apiKey
      $http({
        method: 'POST',
        url: url,
        data: JSON.stringify( { "user" : username, "password" : password } )
      })
        .success(function(response){
          userFactory.username = username;
          setupLogin(response);
          deferred.resolve();
        })
        .error(function(error){
          deferred.resolve();
        });
      return deferred.promise;
    };

    userFactory.isAvailable = function(username){
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: MONGO_URL.baseUrl + 'accounts?q={"user":"' + username + '"}&apiKey=' + MONGO_URL.apiKey
      })
        .success(function(response){
          var isNameAvailable = response.length === 0;
          deferred.resolve(isNameAvailable);
        })
        .error(function(error){

        });

      return deferred.promise;
    };

    userFactory.logout = function(){
      var deferred = $q.defer();
      delete $cookies.bulletin;
      delete this.isLoggedIn;
      delete this.username;
      delete this.token;
      delete this.loginError;
      delete this.password;
      deferred.resolve();
      return deferred.promise;
    };

    userFactory.autoLogin = function() {
      var deferred = $q.defer();
      //check cookie, get token from it
      var cookie = $cookies.bulletin;
      if(cookie){
        cookie = cookie.substring(0, cookie.indexOf(';'));
        var cookieObj = angular.fromJson(cookie);
        this.username = cookieObj.username
        this.token = cookieObj.token;
        //query api, passing in token
        $http({
          method: 'GET',
          url: MONGO_URL.baseUrl + 'accounts?q={"user":"' + this.username + '","token":"' + this.token + '"}&apiKey=' + MONGO_URL.apiKey// + '&callback=JSON_CALLBACK'
        })
          .success(function(response){
            //if matches, user is logged in
            if(response.length > 0){
              response = response[0];
            }
            setupLogin(response, {isAutoLogin: true});
            deferred.resolve();
          })
          .error(function(){});
      } else{
        deferred.resolve();
      }

      return deferred.promise;
    };



    userFactory.UpdateVotingRecord = function(message, isUpVote){
      if(!this.votingRecord){
        this.votingRecord = [];
      }
      this.votingRecord = _.without(this.votingRecord, _.findWhere(this.votingRecord, {messageId: message._id.$oid}));
      this.votingRecord.push({
        messageId: message._id.$oid,
        isUpVote: isUpVote
      });
      var url = MONGO_URL.baseUrl + 'accounts?q={"user":"' + userFactory.username + '"}&apiKey=' + MONGO_URL.apiKey;
      return $http({
        method: 'PUT',
        url: url,
        data: JSON.stringify( { "$set" : { "votingRecord" : this.votingRecord } } )
      });
    }

    return userFactory;


  });