angular.module('codeSide')
  .controller('LogRegController', ['$scope', '$stateParams', 'Auth', '$state', '$rootScope', 'DatabaseRef', '$firebaseObject',
    function($scope, $stateParams, Auth, $state, $rootScope, DatabaseRef, $firebaseObject) {
      // init empty form
      $scope.formData = {};
      $scope.login = function() {
        if (!$scope.formData.email && !$scope.formData.password) {
          toastr.error("Add email and password");
        } else {
          Auth.$signInWithEmailAndPassword($scope.formData.email, $scope.formData.password)
            .then(function(firebaseUser) {
              // if rootscope is set
              if ($stateParams.toWhere !== null) {
                // console.log('I should go to ', $stateParams.toWhere.name);
                $state.go($stateParams.toWhere.name);
                $stateParams.toWhere = null;
              } else {
                $state.go('admin');
              };

              if (!firebaseUser.emailVerified) {
                // firebaseUser.sendEmailVerification();
                toastr.info('Your email is NOT verified.', 'Verify email!');
                $state.go('admin');
              }
              // $state.go('home');
            })
            .catch(function(error) {
              toastr.error(error.message, error.reason, { timeOut: 10000 });
              $scope.formData = {};
            })
        }
      };

      $scope.register = function() {
        if ($scope.formData.email && $scope.formData.password && $scope.formData.username) {
          console.log($scope.formData.email, $scope.formData.password);
          Auth.$createUserWithEmailAndPassword($scope.formData.email, $scope.formData.password)
            .then(function(firebaseUser) {
              // create user at /users/ endpoint
              DatabaseRef
                .child('users')
                .child(firebaseUser.uid)
                .set({
                  username: $scope.formData.username,
                  displayName: firebaseUser.displayName || '',
                  email: firebaseUser.email,
                })

              toastr.info('Sending email verification link. Check email!', "You've got mail!")
              firebaseUser.sendEmailVerification();

              toastr.success('Awesome! Welcome aboard. Login to begin coding!', 'Register Successful', { timeOut: 7000 });
              $state.go('admin');
            })
            .catch(function(error) {
              toastr.error(error.message, error.reason);
              // reset the form
              $scope.formData = {};
            });
        } else {
          toastr.error('Kindly complete the form', 'Some parts missing!');
        }
      };

      // Social Auths
      // GOOGLE AUTH
      $scope.googleAuth = function() {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');

        Auth.$signInWithPopup(provider)
          .then(function(firebaseUser) {
            var admin = false;
            if (firebaseUser.user.email == 'seanmavley@gmail.com') {
              admin = true;
            };

            console.log(firebaseUser.user);
            var userObject = $firebaseObject(DatabaseRef.child('users').child(firebaseUser.user.uid));
            userObject.$loaded()
              .then(function(data) {
                // don't override
                // data if exist
                userObject.$save({
                  displayName: data.displayName || firebaseUser.user.displayName,
                  email: data.email || firebaseUser.user.email,
                  admin: data.admin || admin,
                  createdAt: new Date().getTime()
                })
              })

            toastr.success('Logged in with Google successfully', 'Success');
            // updateUserIfEmpty(firebaseUser);
            $state.go('admin');
          })
          .catch(function(error) {
            toastr.error(error.message, error.reason);
          })
      }

      // FACEBOOK AUTH
      $scope.facebookAuth = function() {
        var provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('email');

        Auth.$signInWithPopup(provider)
          .then(function(firebaseUser) {
            toastr.success('Logged in with Google successfully', 'Success');
            $state.go('home');
          })
          .catch(function(error) {
            toastr.error(error.message, error.reason);
          })
      }
    }
  ])
