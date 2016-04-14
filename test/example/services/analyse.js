/// <reference path="../vendor/angularjs/angular.js" />
/// <reference path="../scripts/utils.js" />
/// <reference path="../scripts/log.js" />
/// <reference path="../scripts/config.js" />

/**
 * 数据收集分析服务
 */
angular.module(AutoHome.ngModules.services + ".analyse", [])
    .factory("AnalyseSvc", function () {
        var service = {
            /*
             * PV更新
             */
            pv: function (userId) {
                if (isNaN(userId)) {
                    log.e("error user id");
                    throw "user id must be a number.";
                }

                var promise = $http({
                    method: "GET",
                    url: "/Api/Mobile/UpdatePv/" + userId
                });

                return promise;
            }
        };
        return service;
    });