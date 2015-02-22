mc.controller('NavCtrl', ['$scope', '$state', '$stateParams', '$rootScope',
    function ($scope, $state, $stateParams, $rootScope) {

        // Set blank state, $state.current.name is unavailable at this time
        $scope.pageName = '';

        /**
         * On initial page load, the nav button was not selected due to the state
         * not being set in the rootScope, so we listen for the update
         * and set our pageName model accordingly
         */
        $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    $scope.pageName = toState.name; // This updates the checkModel
                }
        );

        // Watch pageName for changes
        $scope.$watchCollection('pageName', function () {
            // If the state is not equal to pageName: update the state; it will be equal on the first change, see above
            if (!$state.is($scope.pageName) && $scope.pageName !== '')
                $state.go($scope.pageName);
        });

        // Dynamically add the states defined in the config to the nav checkModel
        var states = $state.get();
        $scope.checkModel = {};
        for (var s in states) {
            var state = states[s];
            if (state.abstract) // Do not add the first element
                continue;
            $scope.checkModel[state.name] = false; // All false, see above
        }
    }
]);