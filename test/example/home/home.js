/// <reference path="../_config.js" />
/// <reference path="../services/user.js" />
/// <reference path="../services/shop.js" />
/// <reference path="../vendor/angularjs/angular.js" />


/*
 * 主页
 * 选择: 我是车主, 我是买家
 * author: Alan
 * created: 2016-03-21
 */

(function () {
    angular.module(AutoHome.ngModules.modules + ".home", [
        AutoHome.ngModules.services + ".user"
    ]).controller("HomeCtrl", function (UserSvc, ShopSvc, $location, $routeParams) {
        var main = this;
        this.user = UserSvc.info;
        this.wechat = UserSvc.wechat;

        this.categories = ["buyer", "owner"];

        this.error = "";

        this.goTo = function (category) {
            if (this.categories.indexOf(category) === -1) {
                this.error = "错误的选项: " + category;
                return;
            }

            if (category === "owner") {
                $location.path("/owner/bind");
                return;
            }

            this.screen = "buyer";
        };

        /*
         * screen: home, buyer
         */
        this.screen = $routeParams.screen || "home";

        this.selectCancel = function () {
            main.screen = "home";
        };
        this.selectCompletely = function (series, car) {

            var reset = this.reset;

            UserSvc.bindCar({
                carSeriesId: series.seriesId,
                carSpecId: car.specId,
                type: "buyer"
            }).then(function (rep) {
                rep = rep.data;
                if (rep.success) {
                    reset();
                    $location.path("/buyer/home");
                    ShopSvc.updateSelectedInfo(UserSvc.info.dealerId, series.seriesId, car.specId);
                    return;
                }
                alert("失败: " + rep.message);
                main.error = rep.message;
                main.screen = "home";
            });
        };
    });
})();

