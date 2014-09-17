angular.module('bulletinApp')
  .directive('voting', function(MessageService) {
    return {
      restrict: 'EA',
      scope: {
        item: '=message'
      },
      templateUrl: 'scripts/components/home/voting.tpl.html',
      link: function (scope, element, attr) {
        scope.element = element;
        if(scope.item.voted){
          if(scope.item.voted.isUpVote){
            scope.element.find('.up-vote').addClass('voted');
          } else{
            scope.element.find('.down-vote').addClass('voted');
          }
        }
        scope.vote = function(isUp){
          if(scope.item.voted){
            if((isUp && scope.item.voted.isUpVote) || (!isUp && !scope.item.voted.isUpVote) ){
              return;
            } else{
              if(isUp){
                scope.item.voteCount += 2;
                scope.element.find('.up-vote').addClass('voted');
                scope.element.find('.down-vote').removeClass('voted');
              } else{
                scope.item.voteCount -= 2;
                scope.element.find('.down-vote').addClass('voted');
                scope.element.find('.up-vote').removeClass('voted');
              }
            }

          } else{
            if(isUp){
              scope.item.voteCount++;
              scope.element.find('.up-vote').addClass('voted');
            } else{
              scope.item.voteCount--;
              scope.element.find('.down-vote').addClass('voted');
            }
          }

          MessageService.Vote(scope.item, isUp).then(function(){
            scope.item.voted = {};
            scope.item.voted.isUpVote = isUp === 'up';
          });
        };
      }
    };
  });