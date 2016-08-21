angular.module('codeSide')

.controller('AdminController', ['$scope', 'currentAuth',
  function($scope, currentAuth) {
    $scope.authInfo = currentAuth;
    // init empty formData object
    $scope.sendVerifyEmail = function() {
      toastr.info('Sending email verification message to your email. Check inbox now!', 'Email Verification');
      currentAuth.sendEmailVerification();
    }
  }
])
