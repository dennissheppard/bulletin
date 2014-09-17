'use strict';

angular.module('bulletinApp.home', ['services.home', 'services.user', 'services.message'])
  .controller('HomeCtrl',function($scope, $location, HomeService, UserService, MessageService, LoaderService){
    $scope.user = UserService;
    $scope.messageData = MessageService;
    $scope.modalShown = false;
    $scope.search = '';
    $scope.tags = [];
    $scope.allExistingTags = [];




    $scope.newTemplate = {
      field1: 'something',
      field2: 'somethingElse'
    };



    /*scope methods*/

    $scope.createMessage = function(){
      $scope.showNewMessageBox = true;
    };

    $scope.deleteMessage = function(message){
      $scope.messageToDelete = message;
      LoaderService.show();
      MessageService.DeleteMessage($scope.messageToDelete._id.$oid).then(function(response){
          getAllMessages();
          LoaderService.hide();

        },
        function(error){

        });
    };

    $scope.saveMessage = function(){
      LoaderService.show();
      $scope.showNewMessageBox = false;
      var messageData = {
        message: $scope.newMessageContent,
        tags: $scope.tags,
        user: $scope.user
      };
      MessageService.CreateMessage(messageData).then(function(data){
          LoaderService.hide();
          getAllMessages();
        },
        function(error){
          LoaderService.hide();
        });
      delete $scope.newMessageContent;
    };

    $scope.showCommentDialog = function(messageIndex){
      $scope.modalShown = !$scope.modalShown;
      $scope.messageToCommentOn = $scope.messageData.messages[messageIndex];
    };

    $scope.postComment = function(){
      MessageService.PostComment($scope.messageToCommentOn, $scope.messageData.newComment, $scope.user).then(function(response){
          getAllMessages();
          $scope.modalShown = !$scope.modalShown;
      },
      function(error){

      });
    };

    $scope.addTagToMessage = function(){
      var tag = {
        text: $scope.tag
      };
      $scope.tags.push(tag);
    };

    $scope.vote = function(messageIndex, isUp){
      var message = $scope.messageData.messages[messageIndex];
      MessageService.Vote(message, isUp).then(function(response){
        if(isUp){
          $scope.messageData.messages[messageIndex].voteCount++;
        } else{
          $scope.messageData.messages[messageIndex].voteCount--;
        }
      }, function(response){});
    };

    /* private methods */

    var getAllMessages = function(){
      LoaderService.show();
      MessageService.GetAllMessages($scope.user).then(function(data){
          //collect all the tags, take out the duplicates
        _.each($scope.messageData.messages, function(message){
          $scope.allExistingTags.push.apply($scope.allExistingTags, message.tags);
        });
        $scope.allExistingTags = _.unique($scope.allExistingTags, function(item, key, a) {
          return item.text;
        });
        // determine which messages a user has voted on and highlight those
        _.each($scope.messageData.messages, function(message){
          var messageVotedOn = _.find(UserService.votingRecord, function(record){
            return record.messageId === message._id.$oid;
          });
          if(messageVotedOn){
            message.voted = {};
            message.voted.isUpVote = messageVotedOn.isUpVote;
          }
        });

        LoaderService.hide();
      },
      function(error){
        LoaderService.hide();

      });
    };

    /*start up code*/

    if($scope.user.isLoggedIn){
      getAllMessages();
    } else{
      LoaderService.show();
      UserService.autoLogin().then(function(){
        if($scope.user.isLoggedIn){
          getAllMessages();
        }
        else{
          $location.path('/login');
        }
        LoaderService.hide();
      });
    }

  });