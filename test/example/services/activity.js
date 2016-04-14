/// <reference path="../vendor/angularjs/angular.js" />
/// <reference path="../scripts/config.js" />
/// <reference path="../scripts/log.js" />
/// <reference path="../scripts/utils.js" />
/// <reference path="activity.js" />
/// <reference path="analyse.js" />
/// <reference path="auth.js" />
/// <reference path="utils.js" />
/// <reference path="services.js" />
/// <reference path="shop.js" />
/// <reference path="user.js" />

angular.module(AutoHome.ngModules.services + ".activity", [
    AutoHome.ngModules.services + ".user"
    , AutoHome.ngModules.services + ".utils"
]).factory("ActivitySvc", function (UserSvc, $http, UtilsSvc) {
    var service = {

        activityId:9,

        /**
         * 获取用户的奖品信息
         * @returns {promise} 
         */
        getWinAwards: function () {

            var promise = UtilsSvc.asyncWaitPromise(function () {
                return !UserSvc.info.id;
            }, function () {
                return $http({
                    method: "GET",
                    url: "/Api/Mobile/QueryDrawAwards/" + UserSvc.info.id
                });
            });

            return promise;
        }
    };
    return service;
});