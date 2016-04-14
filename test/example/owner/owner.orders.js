/// <reference path="../_config.js" />
/// <reference path="../vendor/angularjs/angular.js" />
/// <reference path="../services/user.js" />
/// <reference path="../services/auth.js" />
/// <reference path="../services/services.js" />
/// <reference path="../services/shop.js" />

/*
 * 车主 -> 询价列表
 */
angular.module(AutoHome.ngModules.modules + ".owner.orders", [])
    .controller("OwnerOrdersCtrl", function ($location, UserSvc) {
        this.orders = UserSvc.orders;
    });