angular.module("codeSide")
.factory("DatabaseRef", function() {
  return firebase.database().ref();
});
