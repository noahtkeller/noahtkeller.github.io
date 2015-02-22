mc.directive('loginButton', ['googleLogin',
    function (googleLogin) {
        var link = function link(scope, element, attrs) {
            scope.loginText = 'Login';
            scope.inOut = 'in';
            scope.authenticated = false;
            scope.login = function () {
                if (scope.authenticated) {
                    googleLogin.signOut();
                    scope.authenticated = false;
                    scope.inOut = 'in';
                    scope.loginText = 'Login';
                    return;
                }
                googleLogin.signIn();
            };
        };
        return {
            restrict: 'AE',
            controller: "LoginButtonCtrl",
            template: '<label class="btn btn-danger" ng-click=\'login();\'><i class="glyphicon glyphicon-log-{{inOut}}"></i>\n{{loginText}}</label>',
            replace: true,
            compile: function (element, attrs, transclude) {
                return link;
            }
        };
    }
]);

mc.controller('LoginButtonCtrl', ['$scope',
    function ($scope) {
        if ($scope.loginButtinListener === undefined)
            $scope.loginButtinListener = $scope.$on("google:authenticated", function () {
                $scope.$apply(function () {
                    $scope.authenticated = true;
                    $scope.inOut = 'out';
                    $scope.loginText = 'Logout';
                });
            });
    }
]);