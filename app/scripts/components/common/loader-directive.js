angular.module('bulletinApp')
  .directive('loader', function() {
    return {
      restrict: 'EA',
      template: '<div class="loader" ng-show="show"></div>',
      controller: function ($scope, LoaderService) {
        $scope.loader = LoaderService;
        $scope.$watch('loader.isVisible', toggleDisplay);

        function toggleDisplay() {
          $scope.show = !!($scope.loader.isVisible);
        }
      }
    };
  });