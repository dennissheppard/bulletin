angular.module('services.message', [])
  .factory('MessageService', function($http, UserService){
    var MONGO_URL = {
      baseUrl: 'https://api.mongolab.com/api/1/databases/bulletin/collections/',
      apiKey: '5odPlHB745xUKDuNUG-WxzC9JrszwB2X'
    };
    var MessageService = {};

    MessageService.GetAllMessages = function(user){
      return $http({
        method: 'GET',
        url: MONGO_URL.baseUrl + 'messages?apiKey=' + MONGO_URL.apiKey
      })
        .success(function(response){
          var messages = [];

          _.each(response, function(message){
            if(!message.voteCount){
              message.voteCount = 0;
            }
            if(message.user === user.username){
              message.canDelete = true;
            }
            message.comments = _.where(response, {parentMessage: message._id.$oid });

            if(!message.parentMessage || message.parentMessage.length === 0){
              messages.push(message);
            }
          });

          MessageService.messages = messages;
        })
        .error(function(error){

        });
    };

    MessageService.DeleteMessage = function(messageId){
      var url = MONGO_URL.baseUrl + 'messages?q={"_id":{"$oid":"' + messageId + '"}}&apiKey=' + MONGO_URL.apiKey
      return $http({
        method: 'PUT',
        url: url,
        data: JSON.stringify([])
      });

    };

    MessageService.CreateMessage = function(messageData){
      var data = {
        "message": messageData.message,
        "user": messageData.user.username,
        "date": new Date(),
        "parentMessage": '',
        "tags": messageData.tags ? messageData.tags : [],
        "voteCount": 0
      };
      var url = MONGO_URL.baseUrl + 'messages?apiKey=' + MONGO_URL.apiKey
      return $http({
        method: 'POST',
        url: url,
        data: JSON.stringify( data )
      });
    };

    MessageService.EditMessage = function(message){
      var url = MONGO_URL.baseUrl + 'messages?q={"id":"' + message.id + '"}&apiKey=' + MONGO_URL.apiKey
      return $http({
        method: 'PUT',
        url: url,
        data: JSON.stringify( { "$set" : { "message" : message.message } } )
      });
    };

    MessageService.PostComment = function(messageToCommentOn, newComment, user){
      var url = MONGO_URL.baseUrl + 'messages?apiKey=' + MONGO_URL.apiKey;
      var data = {
        "message": newComment,
        "user": user.username,
        "date": new Date(),
        "parentMessage": messageToCommentOn._id.$oid
      };
      return $http({
        method: 'POST',
        url: url,
        data: JSON.stringify( data )
      });
    };

    MessageService.Vote = function(messageToVoteOn, isUpVote){
      var url = MONGO_URL.baseUrl + 'messages?q={"_id":{"$oid":"' + messageToVoteOn._id.$oid + '"}}&apiKey=' + MONGO_URL.apiKey

      var currentVoteCount = !messageToVoteOn.voteCount ? 0 : messageToVoteOn.voteCount;

      return $http({
        method: 'PUT',
        url: url,
        data: JSON.stringify( { "$set" : { "voteCount" : currentVoteCount } } )
      }).success(function(response){
          UserService.UpdateVotingRecord(messageToVoteOn, isUpVote);
        });


    };

    return MessageService;
  });
