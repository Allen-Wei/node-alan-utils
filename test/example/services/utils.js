/// <reference path="../vendor/angularjs/angular.js" />
/// <reference path="../scripts/config.js" />
/// <reference path="../scripts/log.js" />
/// <reference path="../scripts/utils.js" />

/**
 * @description 实用方法
 * @version 2016-04-08
 */
angular.module(AutoHome.ngModules.services + ".utils", [])
    .factory("UtilsSvc", function ($q, $timeout) {

        var service = {

            /**
             * 异步等待某个条件成立时继续执行
             * @param {function} wait 返回true继续等待, 返回false执行callback
             * @param {function} callback 
             * @param {int} time 每次等待时长
             * @returns {this} 
             */
            asyncWait: function (wait, callback, time) {
                if (wait()) {
                    $timeout(function () {
                        service.asyncWait(wait, callback);
                    }, time || 1000);
                } else {
                    callback();
                }
                return service;
            },

            /**
             * 异步等待某个条件成立时执行回调里的promise
             * @param {function} wait 返回true继续等待, 返回false执行callback
             * @param {function} callbackPromise 回调函数执行完毕返回promise
             * @param {int} time 每次等待时长
             * @returns {promise} 
             */
            asyncWaitPromise: function (wait, callbackPromise, time) {
                var defer = $q.defer();
                this.asyncWait(wait, function () {
                    callbackPromise().then(function (rep) {
                        defer.resolve(rep);
                    }, function (rep) {
                        defer.reject(rep);
                    });
                }, time);

                return defer.promise;
            }

        };
        return service;
    });