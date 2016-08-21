angular.module('codeSide', ['ui.router', 'firebase', 'ngProgress', 'ui.router.title'])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home/home.html',
        controller: 'HomeController',
        resolve: {
          currentAuth: ['Auth', function(Auth) {
            return Auth.$requireSignIn()
          }]
        },
        meta: {
          title: 'Homepage',
          description: 'Your Favorite Programming Languages, Side By Side'
        },
      })
      .state('emailVerify', {
        url: '/verify-email?mode&oobCode',
        templateUrl: 'auth/verify-email.html',
        controller: 'emailVerifyController',
        resolve: {
          currentAuth: ['Auth', function(Auth) {
            return Auth.$requireSignIn()
          }]
        },
        meta: {
          title: 'Verify Email',
          description: 'Email Verification'
        }
      })
      .state('signup', {
        url: '/register',
        templateUrl: 'auth/register.html',
        controller: 'LogRegController',
        meta: {
          title: 'Sign up'
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'auth/login.html',
        controller: 'LogRegController',
        params: {
          message: null,
          toWhere: null
        },
        meta: {
          title: 'Login'
        }
      })
      .state('admin', {
        url: '/admin',
        templateUrl: 'admin/admin.html',
        controller: 'AdminController',
        resolve: {
          currentAuth: ['Auth', function(Auth) {
            return Auth.$requireSignIn()
          }]
        },
        meta: {
          title: 'Dashboard'
        }
      })

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  }
])

.run(['$rootScope', '$state', '$location', 'Auth', 'ngProgressFactory',
  function($rootScope, $state, $location, Auth, ngProgressFactory) {
    // ngMeta.init();
    var progress = ngProgressFactory.createInstance();
    var afterLogin;

    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
      if (error === "AUTH_REQUIRED") {
        $state.go('login', { toWhere: toState });
        progress.complete();
      }
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      progress.start();
    });

    $rootScope.$on('$stateChangeSuccess', function() {
      $rootScope.title = $state.current.meta.title;
      $rootScope.description = $state.current.meta.description;
      progress.complete();
    });
  }
])
