angular.module('codeSide')
  .controller('MenuController', ['$scope', 'Auth', '$state', function($scope, Auth, $state) {

    Auth.$onAuthStateChanged(function(firebaseUser) {
      if (firebaseUser != null) {
        $scope.loggedIn = true;
      } else {
        $scope.loggedIn = false;
      }
    })

    $scope.logout = function() {
      Auth.$signOut();
      Auth.$onAuthStateChanged(function(firebaseUser) {
        console.log('loggedout');
      });
      $state.go('login');
    }
  }])
