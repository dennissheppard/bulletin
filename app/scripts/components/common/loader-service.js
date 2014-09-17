angular.module('services.loader', [])
  .factory('LoaderService', function(){
    return {
      isVisible: false,
      show: function() {
        this.isVisible = true;
      },
      hide: function(msg) {
        this.isVisible = false;
      }
    }

  });