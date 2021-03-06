mc.directive('markdown', ['$http', '$compile',
    function ($http, $compile) {
        var link = function link(scope, element, attrs) {
            $http({method: 'GET', url: attrs.url})
                    .then(function (markdownData) {
                        element.html(markdown.toHTML(markdownData.data));
                        $compile(element.contents())(scope);
                    });
        };
        return {
            restrict: 'AE',
            controller: "MarkdownCtrl",
            template: '<div>{{markdownData}}</div>',
            replace: true,
            compile: function (element, attrs, transclude) {
                return link;
            }
        };
    }
]);

mc.controller('MarkdownCtrl', ['$scope',
    function ($scope) {

    }
]);