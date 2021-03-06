var bsd = angular.module('bStudioDirectives', []);

bsd.directive('kdRemoteVal', function ($q, $http) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var lk = attrs.url;
            var id = elem.val();
            var spanName = elem.attr("name");
            var span = angular.element("span[id=" + spanName + "]");
            ctrl.$asyncValidators.kdRemoteVal = function (mv, vv) {
                if (ctrl.$isEmpty(mv))
                    return $q.when();
                var promise = $q.defer();
                $http.get(attrs.url, { params: { ID: elem.val() } })
                .success(function () {
                    span.html("")
                    scope.Verified = true;
                    promise.resolve();
                })
                .error(function (d, s) {
                    switch (s) {
                        case 404:
                            span.html("not found");
                            break;
                        case 406:
                            span.html(elem.val() + " already exits");
                            break;
                        default:
                            span.html("Server error occured");
                            break;
                    }
                    span.attr("class", "text-danger");
                    scope.Verified = false;
                    promise.reject();
                })
                return promise.promise;
            };
        }
    };
});

bsd.directive('kdCompareVal', function () {
    return {
        require: 'ngModel',
        restrict: "A",
        link: function (scope, elem, attrs, ctrl) {
            var id = elem.val(); // value of the element
            var spanName = elem.attr("name"); // extracts the name of the element to use to find the span
            var comp = attrs.comp // the 'comp attribute on the element
            var comElem = angular.element("input[name=" + comp + "]"); // finds the element to compare values from
            var span = angular.element("span[id=" + spanName + "]"); //the span to display the error; has an id as the name of the element
            ctrl.$validators.kdCompareVal = function (mv, vv) {
                if (ctrl.$isEmpty(mv) || ctrl.$isEmpty(comElem.val()))
                    span.html('both elements must be filled');
                else {
                    if (mv === comElem.val()) {
                        span.html("");
                        span.removeClass("text-danger")
                        scope.Verified = true;
                        return true;
                    }
                    else {
                        scope.Verified = false;
                        span.attr("class", "text-danger");
                        span.html("The two items mismatch");
                    }
                    return false; // only a false value can be returned no matter what
                };
            }
        }
    }
});

bsd.directive('kdRangeVal', function () {
    return {
        require: 'ngModel',
        restrict: "A",
        link: function (scope, elem, attrs, ctrl) {
            var max = parseInt(attrs.kdMax),
                min = parseInt(attrs.kdMin),
             spanName = elem.attr("name"),
            span = angular.element("span[id=" + spanName + "]");
            ctrl.$validators.kdRangeVal = function (mv, vv) {
                if (ctrl.$isEmpty(mv))
                    return true;
                if (min >= max) {
                    span.html("minimum value cannot be greater than or equal to the max value")
                    span.removeClass("text-danger")
                    return false
                }
                if (parseInt(mv) >= min && parseInt(mv) <= max) {
                    span.html("");
                    span.removeClass("text-danger")
                    return true;
                }
                span.addClass("text-danger")
                span.html("Field must be between " + min + " and " + max)
                return false;
                // }
            }
        }
    }
})