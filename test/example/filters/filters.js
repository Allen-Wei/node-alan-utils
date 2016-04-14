/// <reference path="../vendor/angularjs/angular.js" />
/// <reference path="../scripts/config.js" />

/**
 * 过滤器
 */
angular.module(AutoHome.ngModules.filters, [
    AutoHome.ngModules.filters + ".convertMoney"
    , AutoHome.ngModules.filters + ".prettyDate"
]);