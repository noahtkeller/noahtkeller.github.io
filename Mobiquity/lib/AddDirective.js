mc.directive('add', ['Calendar', '$rootScope',
    function (Calendar, $rootScope) {
        var link = function link(scope, element, attrs) {
            scope.$watch(Calendar.getDate, function (d) {           
                scope.startTime.setDate(Calendar.getDate().getDate());
                scope.startTime.setMonth(Calendar.getDate().getMonth());
                scope.startTime.setYear(Calendar.getDate().getFullYear());
                scope.endTime.setDate(Calendar.getDate().getDate());
                scope.endTime.setMonth(Calendar.getDate().getMonth());
                scope.endTime.setYear(Calendar.getDate().getFullYear());
            });
            scope.startTime = new Date();
            scope.endTime = new Date();
            scope.startTime.setHours(12);
            scope.startTime.setMinutes(0);
            scope.startTime.setSeconds(0);
            scope.startTime.setMilliseconds(0);
            scope.endTime.setHours(13);
            scope.endTime.setMinutes(0);
            scope.endTime.setSeconds(0);
            scope.endTime.setMilliseconds(0);
            scope.summary = '';
            scope.description = '';
            scope.location = '';

            scope.hstep = 1;
            scope.mstep = 15;

            scope.options = {
                hstep: [1, 2, 3],
                mstep: [1, 5, 10, 15, 25, 30]
            };

            scope.createEvent = function () {
                Calendar.createEvent({
                    summary: scope.summary,
                    description: scope.description,
                    location: scope.location,
                    status: "confirmed",
                    start: {
                        dateTime: Calendar.dateTimeString(scope.startTime, true)
                    },
                    end: {
                        dateTime: Calendar.dateTimeString(scope.endTime, true)
                    }
                }, function (res) {
                    res.start = Calendar.format12Hour(new Date(res.start.dateTime));
                    res.end = Calendar.format12Hour(new Date(res.end.dateTime));
                    Calendar.loadEvent(null, res);
                });
            };

            scope.isMeridian = true;

        };
        return {
            restrict: 'AE',
            controller: "AddEventCtrl",
            templateUrl: 'add.html',
            replace: false,
            compile: function (element, attrs, transclude) {
                return link;
            }
        };
    }
]);

mc.controller('AddEventCtrl', ['$scope',
    function ($scope) {

    }
]);