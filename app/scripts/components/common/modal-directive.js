//stolen from http://adamalbrecht.com/2013/12/12/creating-a-simple-modal-dialog-directive-in-angular-js/

angular.module('bulletinApp')
  .directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};

      if(attrs.width){
        scope.dialogStyle.width = attrs.width;
      }

      if(attrs.height){
        scope.dialogStyle.height = attrs.height;
      }

      if(attrs.title){
        scope.title = attrs.title;
      }

      scope.hideModal = function() {
        scope.show = false;
      };
    },
    templateUrl: 'scripts/components/common/modal.tpl.html'
  };
});