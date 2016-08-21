angular.module('codeSide')

.controller('HomeController', ['$scope', 'currentAuth',
  function($scope, currentAuth) {
    console.log(currentAuth.emailVerified);
    $scope.verified = currentAuth.emailVerified;
  }
])
