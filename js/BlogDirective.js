ngio.directive('blog', ['Blog',
    function (Blog) {
        var link = function link(scope, element, attrs) {
            
        };
        return {
            restrict: 'AE',
            controller: "",
            templateUrl: 'templates/blog.html',
            replace: false,
            compile: function (element, attrs, transclude) {
                return link;
            }
        };
    }
]);