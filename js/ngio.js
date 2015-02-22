'use strict';

var ngio = angular.module('ngio', ['ui.bootstrap', 'ui.router', 'firebase']);

ngio.config(['$logProvider', '$locationProvider', '$urlRouterProvider', '$stateProvider', '$controllerProvider', '$compileProvider',
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
                })
                .state('error', {
                    url: '/error/:code',
                    controller: 'errorController',
                    templateUrl: '/templates/pages/error.html'
                });

        $logProvider.debugEnabled(true);
    }
]);

ngio.controller("bodyController", ['$scope',
    function ($scope) {
        console.log('body controller');
        $scope.states = [
            {
                title: 'Home',
                icon: 'glyphicon glyphicon-home',
                name: 'home'
            },
            {
                title: 'About',
                icon: 'glyphicon glyphicon-question-sign',
                name: 'about'
            }
        ];
        console.log($scope.states);
    }
]);