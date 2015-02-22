mc.controller('MainCtrl', ['$scope', 'Calendar',
    function ($scope, Calendar) {
        
        Calendar.loadHardCalendars();

        if ($scope.mainSignoutListener === undefined)
            $scope.mainSignoutListener = $scope.$on('google:signOut', function () {
                Calendar.clearUserCalendars();
            });

        if ($scope.calListener === undefined) {
            Calendar.clearUserCalendars();
            $scope.calListener = $scope.$on('googleCalendar:loaded', function () {
                Calendar.listCalendars();
            });
        }
    }
]);