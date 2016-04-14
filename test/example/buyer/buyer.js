/// <reference path="../scripts/config.js" />
/// <reference path="../scripts/log.js" />
/// <reference path="../vendor/angularjs/angular.js" />
/// <reference path="../scripts/utils.js" />

/*
 * 买车: 主页
 */
(function () {
    angular.module(AutoHome.ngModules.modules + ".buyer", [
        AutoHome.ngModules.modules + ".buyer.home"
        , AutoHome.ngModules.modules + ".buyer.orders"
        , AutoHome.ngModules.modules + ".buyer.center"
        , AutoHome.ngModules.modules + ".buyer.activities"
    ]);

})();