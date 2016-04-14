/// <reference path="../scripts/config.js" />
/// <reference path="../scripts/log.js" />
/// <reference path="../scripts/utils.js" />
/// <reference path="../services/analyse.js" />
/// <reference path="../services/auth.js" />
/// <reference path="../services/services.js" />
/// <reference path="../services/shop.js" />
/// <reference path="../services/user.js" />
/// <reference path="../vendor/angularjs/angular.js" />

/**
 * 个人中心
 * date: 2016-04-08 16:36
 */

angular.module(AutoHome.ngModules.modules + ".owner.center", [
    AutoHome.ngModules.services + ".user"
]).controller("OwnerCenterCtrl", function (UserSvc) {
    var main = this;
    this.user = UserSvc.info;

    this.salerName = "暂无";

    if (UserSvc.orders && UserSvc.orders.length) {
        main.salerName = UserSvc.orders[UserSvc.orders.length - 1].SalesName;
    }
});