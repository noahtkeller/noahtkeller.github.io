angular.module('ngio', ['ui.bootstrap', 'ui.router', 'firebase'])
  .config(['$logProvider', '$locationProvider', '$urlRouterProvider', '$stateProvider', '$controllerProvider', '$compileProvider',
    function ($logProvider, $locationProvider, $urlRouterProvider, $stateProvider, $controllerProvider, $compileProvider) {
        ngio.locationProvider = $locationProvider;
        ngio.urlRouterProvider = $urlRouterProvider;
        ngio.stateProvider = $stateProvider;
        ngio.controllerProvider = $controllerProvider;
        ngio.compileProvider = $compileProvider;

        $urlRouterProvider.otherwise("/");

        $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: '/templates/pages/home.html'
                })
                .state('about', {
                    url: '/about',
                    templateUrl: '/templates/pages/about.html'
                });

        $logProvider.debugEnabled(true);
    }
  ]);