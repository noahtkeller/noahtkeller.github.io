mc.controller('CalendarPageCtrl', ['$scope', 'Calendar',
    function ($scope, Calendar) {

        $scope.activeCalendar = '';
        $scope.isAddCollapsed = true;
        $scope.format = 'MMMM dd, yyyy';
        $scope.date = Calendar.formatDate(Calendar.getDate());
        $scope.calendars = {};

        $scope.$watch('date', function () {
            Calendar.setDate(new Date($scope.date));
        });

        $scope.$watch('activeCalendar', function () {
            Calendar.activeCalendar($scope.activeCalendar);
        });

        $scope.today = function () {
            $scope.date = Calendar.formatDate(new Date());
        };

        Calendar.getCalendar(null, addCalendar, function (cals) {
            $scope.calendars = cals;
            if ($scope.activeCalendar === '')
                for (var cal in cals)
                    return $scope.activeCalendar = cals[cal].id;

        });

        function addCalendar(cal) {
            if ($scope.activeCalendar === '') {
                $scope.activeCalendar = cal.id;
                Calendar.active = cal.id;
            }
            $scope.calendars[cal.id] = cal;
        }

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        if ($scope.calSignoutListener === undefined)
            $scope.calSignoutListener = $scope.$on('google:signOut', function () {
                $scope.activeCalendar = '';
                $scope.calendars = {};
                Calendar.clearUserCalendars();
            });

        if ($scope.calSigninListener === undefined)
            $scope.calSigninListener = $scope.$on('google:signOut', function () {
                Calendar.getCalendar();
            });
    }
]);