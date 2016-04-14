/// <reference path="../vendor/angularjs/angular.js" />
/// <reference path="../_config.js" />
/// <reference path="../services/user.js" />
/// <reference path="../services/shop.js" />
/// <reference path="../services/auth.js" />

/*
 * 我是车主
 *      填写车主信息
 *      个人中心
 *      订单记录
 */
(function () {
    angular.module(AutoHome.ngModules.modules + ".owner", [
        AutoHome.ngModules.services + ".shop",
        AutoHome.ngModules.services + ".user",
        AutoHome.ngModules.modules + ".owner.bind",
        AutoHome.ngModules.modules + ".owner.home",
        AutoHome.ngModules.modules + ".owner.orders",
        AutoHome.ngModules.modules + ".owner.center",
        AutoHome.ngModules.modules + ".owner.activities",
        AutoHome.ngModules.modules + ".owner.games.list"
    ])
    .factory("CarNoSvc", function ($q) {
        var service = {
            getCarNoLocs: function () {
                var defer = $q.defer();
                defer.resolve([{
                    id: 1,
                    value: "京"
                }, {
                    id: 2,
                    value: "津"
                }, {
                    id: 3,
                    value: "冀"
                }]);
                return defer.promise;
            }
        };
        return service;
    });

})();

