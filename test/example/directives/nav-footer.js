/// <reference path="../_config.js" />
/// <reference path="../services/shop.js" />
/// <reference path="../vendor/angularjs/angular.js" />

/*
 * 底部导航
 * author: Alan
 * created: 2016-04-05
 */

(function () {

    angular.module(AutoHome.ngModules.directives + ".navFooter", [])
        .directive("navFooter", function () {
            return {
                restrict: "E",
                templateUrl: "directives/nav-footer.html",
                controller: function ($scope, $location, UserSvc) {
                    var main = $scope.main = {};
                    main.isActived = function (reg) {
                        var regObj = new RegExp(reg);
                        var path = $location.path();

                        return regObj.test(path);
                    };
                    main.links = {
                        personal: function () {
                            var url = "/{0}/center".format([UserSvc.info.type]);
                            $location.path(url);
                            return false;
                        }
                    };
                },
                link: function (scope, iElement, iAttrs, ctrl) { },
                scope: {}
            }
        });

})();