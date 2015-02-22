var mc = angular.module('MobiquityChallenge', ['ui.bootstrap', 'ui.router', 'googleApi']);

// Include injections in array so future minification does not cause errors
mc.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', 'googleLoginProvider',
    function ($locationProvider, $stateProvider, $urlRouterProvider, googleLoginProvider) {
        
        var clientIds = {
            local: "560378492364-h7svn99h1kki4dl5mv411sf15e602hjh.apps.googleusercontent.com",
            githubio: "560378492364-t8vqjtllh4hhunja4f945rq76m4nvtkc.apps.googleusercontent.com"
        };
        
        googleLoginProvider.configure({
            clientId: document.location.origin.match(/^http(s)?\:\/\/noahtkeller.me/) === null ? clientIds.local : clientIds.githubio,
            scopes: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/plus.login"]
        });
        
        /**
         *  Attribute injections to mc object for external use
         *  may be not so useful in this application, but handy for things
         *  such as dynamic states instead of defining them below.
         */
        mc.locationProvider = $locationProvider;
        mc.stateProvider = $stateProvider;
        mc.urlRouterProvider = $urlRouterProvider;
        
        // If url is not recognized, redirect home
        $urlRouterProvider.otherwise('/');
        
        // Define the states of the application, and assigns urls
        $stateProvider
                .state('readme', {
                    url: '/',
                    template: '<markdown url="README.md" data="{{markdownData}}" class="section"></markdown>'
                })
                .state('instructions', {
                    url: '/instructions',
                    template: '<markdown url="INSTRUCTIONS.md" data="{{markdownData}}" class="section"></markdown>'
                })
                .state('calendar', {
                    url: '/calendar',
                    templateUrl: 'calendar.html',
                    controller: 'CalendarPageCtrl'
                });
                
        $locationProvider.html5Mode(false);
    }
]);