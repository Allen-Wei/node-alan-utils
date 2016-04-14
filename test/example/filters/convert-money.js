/// <reference path="../vendor/angularjs/angular.js" />
/// <reference path="../scripts/utils.js" />
/// <reference path="../scripts/log.js" />
/// <reference path="../scripts/config.js" />

/**
 * 将金额转换成 万元为单位
 * @example 23000 | convertMoney    => 2万元
 */
angular.module(AutoHome.ngModules.filters + ".convertMoney", [])
    .filter("convertMoney", function () {
        return function (input) {
            if (input === undefined || input === null) {
                log.e("convertMoney: 错误的输入: ", input);
                return 0;
            };
            input = parseInt(input);
            if (isNaN(input)) {
                log.e("convertMoney: 错误的输入: ", input);
                return 0;
            }

            return "{0}万元".format([(input / 10000).toFixed(2)]);
        };
    });