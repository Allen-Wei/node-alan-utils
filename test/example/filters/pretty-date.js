/// <reference path="../vendor/angularjs/angular.js" />
/// <reference path="../scripts/config.js" />
/// <reference path="../scripts/log.js" />
/// <reference path="../scripts/utils.js" />

/**
 * 格式化日期显示
 * @example 2016-04-08T17:23:32.6557135+08:00 | prettyDate  => 2016-04-08 17:23:32
 */
angular.module(AutoHome.ngModules.filters + ".prettyDate", []).filter("prettyDate", function () {
    return function (input) {
        if (typeof (input) !== "string") return input;

        //2016-04-08T17:23:32.6557135+08:00
        var reg = /^(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})\.\d+\+\d+:\d+$/g;
        if (reg.test(input))
            return input.replace(reg, "$1 $2");
        return input;
    };
});