/// <reference path="../vendor/angularjs/angular.js" />
/// <reference path="../_config.js" />
/// <reference path="../services/user.js" />
/// <reference path="../services/shop.js" />
/// <reference path="../services/auth.js" />

/*
 * 买车 -> 主页
 */
(function () {
    angular.module(AutoHome.ngModules.modules + ".buyer.orders", [])
        .controller("BuyerOrdersCtrl", function ($location, $routeParams, UserSvc ) {
             this.orders = UserSvc.orders;
        });
})();