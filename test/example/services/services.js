/// <reference path="../vendor/angularjs/angular.js" />
/// <reference path="../scripts/config.js" />
/// <reference path="../scripts/log.js" />
/// <reference path="../scripts/utils.js" />
/// <reference path="../_config.js" />

(function () {
    angular.module(AutoHome.ngModules.services, [
        AutoHome.ngModules.services + ".user"
        , AutoHome.ngModules.services + ".auth"
        , AutoHome.ngModules.services + ".shop"
        , AutoHome.ngModules.services + ".auth"
        , AutoHome.ngModules.services + ".analyse"
        , AutoHome.ngModules.services + ".activity"
        , AutoHome.ngModules.services + ".utils"
    ]);
})();